import { useEffect, useState } from 'react'
import { API_BASE_URL, collectionFromResponse, responseError } from '../api'

function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/`, {
          signal: controller.signal,
        })
        if (!response.ok) throw await responseError(response)
        setUsers(collectionFromResponse(await response.json()))
      } catch (loadError) {
        if (!controller.signal.aborted) setError(loadError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadUsers()
    return () => controller.abort()
  }, [])

  return (
    <section aria-labelledby="users-heading">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR COMMUNITY</p>
          <h1 id="users-heading">Athletes</h1>
          <p className="text-secondary mb-0">Meet the people moving with OctoFit.</p>
        </div>
        <span className="count-pill">{users.length} athletes</span>
      </div>
      {loading && <p role="status">Loading athletes…</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {!loading && !error && users.length === 0 && (
        <p className="empty-state">No athletes have joined yet.</p>
      )}
      {!loading && !error && users.length > 0 && (
        <div className="row g-3">
          {users.map((user) => (
            <div className="col-12 col-md-6 col-xl-4" key={user._id ?? user.username}>
              <article className="data-card athlete-card h-100">
                <div className="avatar" aria-hidden="true">
                  {(user.displayName ?? user.username ?? '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2>{user.displayName ?? user.username}</h2>
                  <p className="text-secondary mb-1">@{user.username}</p>
                  <a href={`mailto:${user.email}`} className="small">{user.email}</a>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Users
