import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import GoogleButton from './GoogleButton'
import './Auth.css'

function Signup() {
    const { signup, loginWithGoogle } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
        setError('')
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        setSubmitting(true)
        signup(email, password)
            .then(() => navigate(`/verify-otp?email=${encodeURIComponent(email)}`))
            .catch((err) => setError(err.response?.data?.message || 'Something went wrong'))
            .finally(() => setSubmitting(false))
    }

    const handleGoogleCredential = (credential) => {
        setError('')
        loginWithGoogle(credential)
            .then(() => navigate('/'))
            .catch((err) => setError(err.response?.data?.message || 'Google sign-in failed'))
    }

    return (
        <div className="auth-card">
            <h2>Sign up</h2>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    required
                />
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Creating account...' : 'Sign up'}
                </button>
            </form>
            <div className="auth-links">
                <Link to="/login">Already have an account?</Link>
            </div>
            <p className="auth-divider">or</p>
            <GoogleButton onCredential={handleGoogleCredential} onError={setError} />
        </div>
    )
}

export default Signup
