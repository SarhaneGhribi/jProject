const express = require("express")
const { requireAuth } = require("../auth/authMiddleware")
const controller = require("./donationsController")

const router = express.Router()

router.post("/", requireAuth, controller.create)
router.get("/me", requireAuth, controller.mine)

module.exports = router
