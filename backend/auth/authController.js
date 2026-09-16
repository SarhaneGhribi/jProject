const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const queries = require("./authQueries")
const { sendOtpEmail, sendPasswordResetEmail } = require("./mailer")
const { verifyGoogleIdToken } = require("./googleAuth")

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 10
const RESET_EXPIRY_MINUTES = Number(process.env.PASSWORD_RESET_EXPIRY_MINUTES) || 30
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isValidEmail = (email) => typeof email === "string" && EMAIL_RE.test(email)
const isValidPassword = (password) => typeof password === "string" && password.length >= 8

const sanitizeUser = (user) => ({
    id: user.id,
    email: user.email,
    isVerified: !!user.is_verified,
    hasPassword: !!user.password_hash,
    hasGoogle: !!user.google_id,
})

const signToken = (user) =>
    jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    })

const hashCode = (value) => crypto.createHash("sha256").update(String(value)).digest("hex")

const generateOtp = () => String(crypto.randomInt(0, 1000000)).padStart(6, "0")

const minutesFromNow = (minutes) => new Date(Date.now() + minutes * 60 * 1000)

const issueSignupOtp = (user, callback) => {
    const code = generateOtp()
    queries.createOtp(user.id, hashCode(code), "signup", minutesFromNow(OTP_EXPIRY_MINUTES), (err) => {
        if (err) return callback(err)
        sendOtpEmail(user.email, code).then(() => callback(null)).catch(callback)
    })
}

// POST /auth/signup { email, password }
const signup = (req, res) => {
    const { email, password } = req.body || {}
    if (!isValidEmail(email)) return res.status(400).json({ message: "A valid email is required" })
    if (!isValidPassword(password)) return res.status(400).json({ message: "Password must be at least 8 characters" })

    queries.findUserByEmail(email, (err, existing) => {
        if (err) return res.status(500).json({ message: "Something went wrong" })

        if (existing && existing.is_verified) {
            return res.status(409).json({ message: "An account with this email already exists" })
        }

        bcrypt.hash(password, 10).then((passwordHash) => {
            const afterUser = (err, user) => {
                if (err) return res.status(500).json({ message: "Something went wrong" })
                issueSignupOtp(user, (err) => {
                    if (err) return res.status(500).json({ message: "Could not send verification email" })
                    res.status(201).json({ message: "Account created. Check your email for a verification code." })
                })
            }

            if (existing && !existing.is_verified) {
                // unverified account retrying signup: refresh their password and resend a code
                queries.setUserPassword(existing.id, passwordHash, (err) => {
                    if (err) return res.status(500).json({ message: "Something went wrong" })
                    afterUser(null, existing)
                })
            } else {
                queries.createUser({ email, password_hash: passwordHash, is_verified: 0 }, (err, result) => {
                    if (err) return res.status(500).json({ message: "Something went wrong" })
                    afterUser(null, { id: result.insertId, email })
                })
            }
        })
    })
}

// POST /auth/verify-otp { email, code }
const verifyOtp = (req, res) => {
    const { email, code } = req.body || {}
    if (!isValidEmail(email) || !code) return res.status(400).json({ message: "Email and code are required" })

    queries.findUserByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ message: "Something went wrong" })
        if (!user) return res.status(400).json({ message: "Invalid or expired code" })

        if (user.is_verified) {
            return res.json({ token: signToken(user), user: sanitizeUser(user) })
        }

        queries.getLatestValidOtp(user.id, "signup", (err, otp) => {
            if (err) return res.status(500).json({ message: "Something went wrong" })
            if (!otp || otp.code_hash !== hashCode(code)) {
                return res.status(400).json({ message: "Invalid or expired code" })
            }

            queries.consumeOtp(otp.id, (err) => {
                if (err) return res.status(500).json({ message: "Something went wrong" })
                queries.setUserVerified(user.id, (err) => {
                    if (err) return res.status(500).json({ message: "Something went wrong" })
                    const verifiedUser = { ...user, is_verified: 1 }
                    res.json({ token: signToken(verifiedUser), user: sanitizeUser(verifiedUser) })
                })
            })
        })
    })
}

// POST /auth/resend-otp { email }
const resendOtp = (req, res) => {
    const { email } = req.body || {}
    const genericResponse = () => res.json({ message: "If that account needs verification, a new code was sent." })
    if (!isValidEmail(email)) return genericResponse()

    queries.findUserByEmail(email, (err, user) => {
        if (err || !user || user.is_verified) return genericResponse()
        issueSignupOtp(user, () => genericResponse())
    })
}

// POST /auth/login { email, password }
const login = (req, res) => {
    const { email, password } = req.body || {}
    if (!isValidEmail(email) || !password) return res.status(400).json({ message: "Email and password are required" })

    queries.findUserByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ message: "Something went wrong" })
        if (!user || !user.password_hash) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        bcrypt.compare(password, user.password_hash).then((matches) => {
            if (!matches) return res.status(401).json({ message: "Invalid email or password" })
            if (!user.is_verified) return res.status(403).json({ message: "Please verify your email before logging in" })
            res.json({ token: signToken(user), user: sanitizeUser(user) })
        })
    })
}

// POST /auth/google { credential }
const googleAuth = (req, res) => {
    const { credential } = req.body || {}
    if (!credential) return res.status(400).json({ message: "Missing Google credential" })

    verifyGoogleIdToken(credential)
        .then(({ googleId, email, emailVerified }) => {
            if (!emailVerified) return res.status(400).json({ message: "Google account email is not verified" })

            queries.findUserByGoogleId(googleId, (err, byGoogle) => {
                if (err) return res.status(500).json({ message: "Something went wrong" })
                if (byGoogle) return res.json({ token: signToken(byGoogle), user: sanitizeUser(byGoogle) })

                queries.findUserByEmail(email, (err, byEmail) => {
                    if (err) return res.status(500).json({ message: "Something went wrong" })

                    if (byEmail) {
                        queries.linkGoogleId(byEmail.id, googleId, (err) => {
                            if (err) return res.status(500).json({ message: "Something went wrong" })
                            queries.setUserVerified(byEmail.id, () => {
                                const linked = { ...byEmail, google_id: googleId, is_verified: 1 }
                                res.json({ token: signToken(linked), user: sanitizeUser(linked) })
                            })
                        })
                        return
                    }

                    queries.createUser(
                        { email, password_hash: null, google_id: googleId, is_verified: 1 },
                        (err, result) => {
                            if (err) return res.status(500).json({ message: "Something went wrong" })
                            const created = { id: result.insertId, email, google_id: googleId, is_verified: 1 }
                            res.json({ token: signToken(created), user: sanitizeUser(created) })
                        }
                    )
                })
            })
        })
        .catch(() => res.status(401).json({ message: "Invalid Google credential" }))
}

// POST /auth/forgot-password { email }
const forgotPassword = (req, res) => {
    const { email } = req.body || {}
    const genericResponse = () => res.json({ message: "If that email has an account, a reset link was sent." })
    if (!isValidEmail(email)) return genericResponse()

    queries.findUserByEmail(email, (err, user) => {
        if (err || !user) return genericResponse()

        const rawToken = crypto.randomBytes(32).toString("hex")
        queries.createPasswordReset(user.id, hashCode(rawToken), minutesFromNow(RESET_EXPIRY_MINUTES), (err) => {
            if (err) return genericResponse()
            const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${rawToken}`
            sendPasswordResetEmail(user.email, resetLink)
                .then(genericResponse)
                .catch(genericResponse)
        })
    })
}

// POST /auth/reset-password { token, password }
const resetPassword = (req, res) => {
    const { token, password } = req.body || {}
    if (!token) return res.status(400).json({ message: "Missing reset token" })
    if (!isValidPassword(password)) return res.status(400).json({ message: "Password must be at least 8 characters" })

    queries.getValidPasswordReset(hashCode(token), (err, reset) => {
        if (err) return res.status(500).json({ message: "Something went wrong" })
        if (!reset) return res.status(400).json({ message: "Invalid or expired reset link" })

        bcrypt.hash(password, 10).then((passwordHash) => {
            queries.setUserPassword(reset.user_id, passwordHash, (err) => {
                if (err) return res.status(500).json({ message: "Something went wrong" })
                queries.consumePasswordReset(reset.id, (err) => {
                    if (err) return res.status(500).json({ message: "Something went wrong" })
                    res.json({ message: "Password updated. You can now log in." })
                })
            })
        })
    })
}

// GET /auth/me (requireAuth)
const me = (req, res) => {
    queries.findUserById(req.user.id, (err, user) => {
        if (err) return res.status(500).json({ message: "Something went wrong" })
        if (!user) return res.status(404).json({ message: "User not found" })
        res.json({ user: sanitizeUser(user) })
    })
}

module.exports = {
    signup,
    verifyOtp,
    resendOtp,
    login,
    googleAuth,
    forgotPassword,
    resetPassword,
    me,
}
