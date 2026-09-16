import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

function ResetPassword() {
    const { resetPassword } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') || ''
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
        resetPassword(token, password)
            .then(() => navigate('/login'))
            .catch((err) => setError(err.response?.data?.message || 'Something went wrong'))
            .finally(() => setSubmitting(false))
    }

    if (!token) {
        return (
            <div className="auth-card">
                <h2>Reset password</h2>
                <p className="auth-error">Missing or invalid reset link.</p>
                <Link to="/forgot-password">Request a new one</Link>
            </div>
        )
    }

    return (
        <div className="auth-card">
            <h2>Reset password</h2>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    required
                />
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update password'}
                </button>
            </form>
        </div>
    )
}

export default ResetPassword
