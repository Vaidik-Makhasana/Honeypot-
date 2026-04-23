import { useMemo, useState } from 'react'
import './Auth.css'
import { decodeJwtPayload } from '../utils/authToken'

function Profile() {
  const profile = useMemo(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      return null
    }

    try {
      const decodedPayload = decodeJwtPayload(token)

      if (!decodedPayload) {
        return null
      }

      return {
        email: decodedPayload?.email || '',
        role: decodedPayload?.role || 'user'
      }
    } catch {
      return null
    }
  }, [])

  const [displayName, setDisplayName] = useState('')

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h2>Profile Settings</h2>
          {!profile && <div className="auth-error">Please login to view your profile settings.</div>}

          {profile && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input type="text" value={profile.email} readOnly />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input type="text" value={profile.role} readOnly />
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Set display name"
                />
              </div>

              <button type="button" className="btn-auth" disabled title="Profile updates are not wired yet">
                Save Settings (Coming Soon)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
