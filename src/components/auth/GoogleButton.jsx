import React, { useEffect, useRef } from 'react'

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

function loadGoogleScript() {
    if (window.google?.accounts?.id) return Promise.resolve()
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`)
        if (existing) {
            existing.addEventListener('load', () => resolve())
            existing.addEventListener('error', reject)
            return
        }
        const script = document.createElement('script')
        script.src = GOOGLE_SCRIPT_SRC
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = reject
        document.head.appendChild(script)
    })
}

// renders the official "Sign in with Google" button; calls onCredential(idToken) on success
function GoogleButton({ onCredential, onError }) {
    const buttonRef = useRef(null)
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

    useEffect(() => {
        if (!clientId) return
        let cancelled = false

        loadGoogleScript()
            .then(() => {
                if (cancelled || !window.google?.accounts?.id) return
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: (response) => onCredential(response.credential),
                })
                if (buttonRef.current) {
                    window.google.accounts.id.renderButton(buttonRef.current, {
                        theme: 'outline',
                        size: 'large',
                        width: 280,
                    })
                }
            })
            .catch(() => onError && onError('Could not load Google Sign-In'))

        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId])

    if (!clientId) {
        return <p className="google-auth-disabled">Google sign-in is not configured.</p>
    }

    return <div ref={buttonRef} className="google-button" />
}

export default GoogleButton
