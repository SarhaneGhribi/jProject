// verifies the ID token produced by Google Identity Services on the frontend
// (see src/components/auth/GoogleButton.jsx) against our GOOGLE_CLIENT_ID
const { OAuth2Client } = require("google-auth-library")

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// returns { googleId, email, emailVerified } or throws if the token is invalid
const verifyGoogleIdToken = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    return {
        googleId: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified,
    }
}

module.exports = { verifyGoogleIdToken }
