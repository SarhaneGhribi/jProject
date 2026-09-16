const jwt = require("jsonwebtoken")

// protects a route: requires a valid "Authorization: Bearer <token>" header,
// attaches the decoded payload ({ id, email }) to req.user
const requireAuth = (req, res, next) => {
    const header = req.headers.authorization || ""
    const token = header.startsWith("Bearer ") ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: "Not authenticated" })

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid or expired session" })
        req.user = decoded
        next()
    })
}

module.exports = { requireAuth }
