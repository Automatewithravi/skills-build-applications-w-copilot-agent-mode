import { useEffect, useState } from 'react'
import { API_BASE_URL, collectionFromResponse, responseError } from '../api'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadLeaderboard() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/leaderboard/`, {
          signal: controller.signal,
        })
        if (!response.ok) throw await responseError(response)
        setEntries(collectionFromResponse(await response.json()))
      } catch (loadError) {
        if (!controller.signal.aborted) setError(loadError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadLeaderboard()
    return () => controller.abort()
  }, [])

  return (
    <section aria-labelledby="leaderboard-heading">
      <div className="page-heading">
        <div>
          <p className="eyebrow">FRIENDLY COMPETITION</p>
          <h1 id="leaderboard-heading">Leaderboard</h1>
          <p className="text-secondary mb-0">Celebrate consistency and progress.</p>
        </div>
      </div>
      {loading && <p role="status">Loading leaderboard…</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {!loading && !error && entries.length === 0 && (
        <p className="empty-state">No leaderboard entries yet.</p>
      )}
      {!loading && !error && entries.length > 0 && (
        <div className="data-card leaderboard-list">
          {entries.map((entry, index) => {
            const name = entry.user?.displayName ?? entry.user?.username ?? 'OctoFit member'
            return (
              <div className="leaderboard-row" key={entry._id ?? entry.user?._id ?? index}>
                <span className={`rank-badge ${index < 3 ? 'rank-highlight' : ''}`}>
                  {entry.rank ?? index + 1}
                </span>
                <div className="flex-grow-1">
                  <div className="fw-semibold">{name}</div>
                  <div className="small text-secondary">{entry.user?.email ?? 'Keep up the great work'}</div>
                </div>
                <strong>{entry.points ?? 0} <span className="small fw-normal">pts</span></strong>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Leaderboard
