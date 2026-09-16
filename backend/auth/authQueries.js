// database access layer for authentication (users, OTP codes, password reset tokens)
const conn = require("../db")

const findUserByEmail = (email, callback) => {
    conn.query("select * from users where email = ?", [email], (err, results) => {
        callback(err, results && results[0])
    })
}

const findUserById = (id, callback) => {
    conn.query("select * from users where id = ?", [id], (err, results) => {
        callback(err, results && results[0])
    })
}

const findUserByGoogleId = (googleId, callback) => {
    conn.query("select * from users where google_id = ?", [googleId], (err, results) => {
        callback(err, results && results[0])
    })
}

const createUser = (user, callback) => {
    conn.query("insert into users set ?", user, (err, results) => {
        callback(err, results)
    })
}

const setUserVerified = (userId, callback) => {
    conn.query("update users set is_verified = 1 where id = ?", [userId], (err, results) => {
        callback(err, results)
    })
}

const setUserPassword = (userId, passwordHash, callback) => {
    conn.query("update users set password_hash = ? where id = ?", [passwordHash, userId], (err, results) => {
        callback(err, results)
    })
}

const linkGoogleId = (userId, googleId, callback) => {
    conn.query("update users set google_id = ? where id = ?", [googleId, userId], (err, results) => {
        callback(err, results)
    })
}

const createOtp = (userId, codeHash, purpose, expiresAt, callback) => {
    const sql = "insert into otp_codes (user_id, code_hash, purpose, expires_at) values (?, ?, ?, ?)"
    conn.query(sql, [userId, codeHash, purpose, expiresAt], (err, results) => {
        callback(err, results)
    })
}

// most recent, still-valid (unconsumed, unexpired) OTP for this user/purpose
const getLatestValidOtp = (userId, purpose, callback) => {
    const sql = `select * from otp_codes
                 where user_id = ? and purpose = ? and consumed = 0 and expires_at > now()
                 order by id desc limit 1`
    conn.query(sql, [userId, purpose], (err, results) => {
        callback(err, results && results[0])
    })
}

const consumeOtp = (otpId, callback) => {
    conn.query("update otp_codes set consumed = 1 where id = ?", [otpId], (err, results) => {
        callback(err, results)
    })
}

const createPasswordReset = (userId, tokenHash, expiresAt, callback) => {
    const sql = "insert into password_resets (user_id, token_hash, expires_at) values (?, ?, ?)"
    conn.query(sql, [userId, tokenHash, expiresAt], (err, results) => {
        callback(err, results)
    })
}

const getValidPasswordReset = (tokenHash, callback) => {
    const sql = `select * from password_resets
                 where token_hash = ? and consumed = 0 and expires_at > now()
                 order by id desc limit 1`
    conn.query(sql, [tokenHash], (err, results) => {
        callback(err, results && results[0])
    })
}

const consumePasswordReset = (resetId, callback) => {
    conn.query("update password_resets set consumed = 1 where id = ?", [resetId], (err, results) => {
        callback(err, results)
    })
}

module.exports = {
    findUserByEmail,
    findUserById,
    findUserByGoogleId,
    createUser,
    setUserVerified,
    setUserPassword,
    linkGoogleId,
    createOtp,
    getLatestValidOtp,
    consumeOtp,
    createPasswordReset,
    getValidPasswordReset,
    consumePasswordReset,
}
