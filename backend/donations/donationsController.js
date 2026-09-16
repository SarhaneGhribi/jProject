const { createDonation, getDonationsByUser } = require("./donationsQueries")

// POST /donations (requireAuth) { foundationId, amount }
const create = (req, res) => {
    const { foundationId, amount } = req.body || {}
    const amountNumber = Number(amount)

    if (!foundationId || !Number.isFinite(amountNumber) || amountNumber <= 0) {
        return res.status(400).json({ message: "A foundation and a positive amount are required" })
    }

    createDonation(req.user.id, foundationId, Math.round(amountNumber), (err, donation) => {
        if (err) {
            if (err.message === "Foundation not found") return res.status(404).json({ message: err.message })
            return res.status(500).json({ message: "Something went wrong" })
        }
        res.status(201).json(donation)
    })
}

// GET /donations/me (requireAuth)
const mine = (req, res) => {
    getDonationsByUser(req.user.id, (err, donations) => {
        if (err) return res.status(500).json({ message: "Something went wrong" })
        res.json(donations)
    })
}

module.exports = { create, mine }
