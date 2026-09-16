import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import GoogleButton from './GoogleButton'
import './Auth.css'

function Login() {
    const { login, loginWithGoogle } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
        setError('')
        setSubmitting(true)
        login(email, password)
            .then(() => navigate('/'))
            .catch((err) => {
                const message = err.response?.data?.message || 'Something went wrong'
                setError(message)
                if (err.response?.status === 403) {
                    navigate(`/verify-otp?email=${encodeURIComponent(email)}`)
                }
            })
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
            <h2>Log in</h2>
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Logging in...' : 'Log in'}
                </button>
            </form>
            <div className="auth-links">
                <Link to="/forgot-password">Forgot password?</Link>
                <Link to="/signup">Create an account</Link>
            </div>
            <p className="auth-divider">or</p>
            <GoogleButton onCredential={handleGoogleCredential} onError={setError} />
        </div>
    )
}

export default Login
