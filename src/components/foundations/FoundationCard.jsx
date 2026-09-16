import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createDonation } from '../../api/donations'

const PRESET_AMOUNTS = [10, 25, 50, 100]

function FoundationCard({ foundation, onDonated }) {
    const { user } = useAuth()
    const [amount, setAmount] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [thankYou, setThankYou] = useState(false)
    const [imgError, setImgError] = useState(false)

    const { idfoundations, name, funds, logo, goal } = foundation
    const progressPct = goal ? Math.min(100, Math.round((Number(funds) / Number(goal)) * 100)) : null

    const donate = (value) => {
        setError('')
        const amountNumber = Number(value)
        if (!amountNumber || amountNumber <= 0) {
            setError('Enter an amount greater than 0')
            return
        }
        setSubmitting(true)
        createDonation(idfoundations, amountNumber)
            .then(() => {
                setAmount('')
                setThankYou(true)
                onDonated()
                setTimeout(() => setThankYou(false), 4000)
            })
            .catch((err) => setError(err.response?.data?.message || 'Could not record your donation'))
            .finally(() => setSubmitting(false))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        donate(amount)
    }

    return (
        <div className="foundation-card">
            <div className="foundation-avatar">
                {logo && !imgError ? (
                    <img src={logo} alt="" onError={() => setImgError(true)} />
                ) : (
                    <span>{name.charAt(0).toUpperCase()}</span>
                )}
            </div>
            <h3>{name}</h3>
            <p className="foundation-funds">
                {Number(funds).toLocaleString()} TND raised
                {goal ? ` of ${Number(goal).toLocaleString()} TND goal` : ''}
            </p>
            {progressPct !== null && (
                <div
                    className="progress-track"
                    role="progressbar"
                    aria-valuenow={progressPct}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                    <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
            )}

            {user ? (
                <form onSubmit={handleSubmit} className="donate-form">
                    <div className="preset-amounts">
                        {PRESET_AMOUNTS.map((preset) => (
                            <button
                                type="button"
                                key={preset}
                                className={`chip ${String(preset) === amount ? 'chip-active' : ''}`}
                                onClick={() => setAmount(String(preset))}
                            >
                                {preset} TND
                            </button>
                        ))}
                    </div>
                    <div className="donate-row">
                        <input
                            id={`donation-amount-${idfoundations}`}
                            type="number"
                            min="1"
                            placeholder="Custom amount"
                            aria-label="Donation amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button type="submit" className="btn btn-accent" disabled={submitting}>
                            {submitting ? 'Donating...' : 'Donate'}
                        </button>
                    </div>
                    {error && <p className="donation-error">{error}</p>}
                    {thankYou && <p className="donation-success">Thank you for your donation!</p>}
                </form>
            ) : (
                <p className="donate-login-prompt">
                    <Link to="/login">Log in</Link> to donate to this foundation.
                </p>
            )}
        </div>
    )
}

export default FoundationCard
