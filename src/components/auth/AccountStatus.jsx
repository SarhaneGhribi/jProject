import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AccountStatus() {
    const { user, loading, logout } = useAuth()

    if (loading) return <nav className="account-status" />

    if (user) {
        return (
            <nav className="account-status">
                <span className="account-email">{user.email}</span>
                <Link to="/my-donations">My donations</Link>
                <button type="button" className="btn btn-ghost" onClick={logout}>
                    Log out
                </button>
            </nav>
        )
    }

    return (
        <nav className="account-status">
            <Link to="/login">Log in</Link>
            <Link to="/signup" className="btn btn-primary">Sign up</Link>
        </nav>
    )
}

export default AccountStatus
