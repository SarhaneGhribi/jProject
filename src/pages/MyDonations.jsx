import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchMyDonations } from '../api/donations'

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

    if (authLoading || loading) return <p>Loading your donations...</p>

    if (!user) {
        return (
            <div className="my-donations">
                <p><Link to="/login">Log in</Link> to see your donation history.</p>
            </div>
        )
    }

    return (
        <div className="my-donations">
            <h2>My donations</h2>
            {error && <p className="donation-error">{error}</p>}
            {!error && donations.length === 0 && <p>You haven't made any donations yet.</p>}
            {donations.length > 0 && (
                <table>
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
                                <td>{d.amount} TND</td>
                                <td>{new Date(d.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default MyDonations
