import http from "./http"

export const signup = (email, password) => http.post("/auth/signup", { email, password })
export const verifyOtp = (email, code) => http.post("/auth/verify-otp", { email, code })
export const resendOtp = (email) => http.post("/auth/resend-otp", { email })
export const login = (email, password) => http.post("/auth/login", { email, password })
export const googleAuth = (credential) => http.post("/auth/google", { credential })
export const forgotPassword = (email) => http.post("/auth/forgot-password", { email })
export const resetPassword = (token, password) => http.post("/auth/reset-password", { token, password })
export const fetchMe = () => http.get("/auth/me")
