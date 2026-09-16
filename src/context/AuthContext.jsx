import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            setLoading(false)
            return
        }
        authApi
            .fetchMe()
            .then((res) => setUser(res.data.user))
            .catch(() => localStorage.removeItem('token'))
            .finally(() => setLoading(false))
    }, [])

    const applySession = (data) => {
        localStorage.setItem('token', data.token)
        setUser(data.user)
    }

    const login = (email, password) => authApi.login(email, password).then((res) => applySession(res.data))
    const signup = (email, password) => authApi.signup(email, password)
    const verifyOtp = (email, code) => authApi.verifyOtp(email, code).then((res) => applySession(res.data))
    const resendOtp = (email) => authApi.resendOtp(email)
    const loginWithGoogle = (credential) => authApi.googleAuth(credential).then((res) => applySession(res.data))
    const forgotPassword = (email) => authApi.forgotPassword(email)
    const resetPassword = (token, password) => authApi.resetPassword(token, password)
    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, signup, verifyOtp, resendOtp, loginWithGoogle, forgotPassword, resetPassword, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
