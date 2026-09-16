import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

function ForgotPassword() {
    const { forgotPassword } = useAuth()
    const [email, setEmail] = useState('')
    const [info, setInfo] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
        setSubmitting(true)
        forgotPassword(email)
            .then(() => setInfo('If that email has an account, a reset link was sent.'))
            .catch(() => setInfo('If that email has an account, a reset link was sent.'))
            .finally(() => setSubmitting(false))
    }

    return (
        <div className="auth-card">
            <h2>Forgot password</h2>
            {info && <p className="auth-success">{info}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send reset link'}
                </button>
            </form>
            <div className="auth-links">
                <Link to="/login">Back to login</Link>
            </div>
        </div>
    )
}

export default ForgotPassword
