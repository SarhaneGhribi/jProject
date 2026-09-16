import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

function VerifyOtp() {
    const { verifyOtp, resendOtp } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [email, setEmail] = useState(searchParams.get('email') || '')
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [info, setInfo] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
        setError('')
        setInfo('')
        setSubmitting(true)
        verifyOtp(email, code)
            .then(() => navigate('/'))
            .catch((err) => setError(err.response?.data?.message || 'Something went wrong'))
            .finally(() => setSubmitting(false))
    }

    const handleResend = () => {
        setError('')
        setInfo('')
        resendOtp(email)
            .then(() => setInfo('A new code has been sent if that account needs verification.'))
            .catch(() => setInfo('A new code has been sent if that account needs verification.'))
    }

    return (
        <div className="auth-card">
            <h2>Verify your email</h2>
            <p>Enter the 6-digit code we emailed you.</p>
            {error && <p className="auth-error">{error}</p>}
            {info && <p className="auth-success">{info}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    required
                />
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Verifying...' : 'Verify'}
                </button>
            </form>
            <div className="auth-links">
                <button type="button" onClick={handleResend}>
                    Resend code
                </button>
            </div>
        </div>
    )
}

export default VerifyOtp
