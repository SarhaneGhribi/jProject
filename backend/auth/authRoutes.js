const express = require("express")
const rateLimit = require("express-rate-limit")

const controller = require("./authController")
const { requireAuth } = require("./authMiddleware")

const router = express.Router()

// modest brute-force protection on the auth endpoints that are most worth abusing
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts, please try again later" },
})

router.post("/signup", authLimiter, controller.signup)
router.post("/verify-otp", authLimiter, controller.verifyOtp)
router.post("/resend-otp", authLimiter, controller.resendOtp)
router.post("/login", authLimiter, controller.login)
router.post("/google", authLimiter, controller.googleAuth)
router.post("/forgot-password", authLimiter, controller.forgotPassword)
router.post("/reset-password", authLimiter, controller.resetPassword)
router.get("/me", requireAuth, controller.me)

module.exports = router
