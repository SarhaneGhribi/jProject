import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AccountStatus() {
    const { user, loading, logout } = useAuth()

    if (loading) return null

    if (user) {
        return (
            <div className="account-status">
                <span>Signed in as {user.email}</span>
                <Link to="/my-donations">My donations</Link>
                <button type="button" onClick={logout}>
                    Log out
                </button>
            </div>
        )
    }

    return (
        <div className="account-status">
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
        </div>
    )
}

export default AccountStatus
