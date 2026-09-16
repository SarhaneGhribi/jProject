import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchMyDonations } from '../api/donations'
import './MyDonations.css'

function MyDonations() {
    const { user, loading: authLoading } = useAuth()
    const [donations, setDonations] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }
        fetchMyDonations()
            .then((res) => setDonations(res.data))
            .catch((err) => setError(err.response?.data?.message || 'Could not load your donations'))
            .finally(() => setLoading(false))
    }, [user])

    if (authLoading || loading) return <p className="page-container">Loading your donations...</p>

    if (!user) {
        return (
            <div className="page-container my-donations">
                <p><Link to="/login">Log in</Link> to see your donation history.</p>
            </div>
        )
    }

    const total = donations.reduce((sum, d) => sum + Number(d.amount), 0)

    return (
        <div className="page-container my-donations">
            <h2>My donations</h2>
            {error && <p className="donation-error">{error}</p>}
            {!error && donations.length === 0 && (
                <p className="empty-state">
                    You haven't made any donations yet. <Link to="/">Browse foundations</Link> to get started.
                </p>
            )}
            {donations.length > 0 && (
                <>
                    <p className="donations-total">
                        You've given <strong>{total.toLocaleString()} TND</strong> across {donations.length} donation
                        {donations.length > 1 ? 's' : ''}.
                    </p>
                    <table className="donations-table">
                        <thead>
                            <tr>
                                <th>Foundation</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((d) => (
                                <tr key={d.id}>
                                    <td>{d.foundationName}</td>
                                    <td>{Number(d.amount).toLocaleString()} TND</td>
                                    <td>{new Date(d.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}

export default MyDonations
