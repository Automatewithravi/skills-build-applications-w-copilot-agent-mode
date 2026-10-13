import { useEffect, useState } from 'react'
import { API_BASE_URL, collectionFromResponse, responseError } from '../api'

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadActivities() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/activities/`, {
          signal: controller.signal,
        })
        if (!response.ok) throw await responseError(response)
        setActivities(collectionFromResponse(await response.json()))
      } catch (loadError) {
        if (!controller.signal.aborted) setError(loadError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadActivities()
    return () => controller.abort()
  }, [])

  return (
    <section aria-labelledby="activities-heading">
      <div className="page-heading">
        <div>
          <p className="eyebrow">TRAINING LOG</p>
          <h1 id="activities-heading">Activities</h1>
          <p className="text-secondary mb-0">Recent effort, all in one place.</p>
        </div>
        <span className="count-pill">{activities.length} sessions</span>
      </div>
      {loading && <p role="status">Loading activities…</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {!loading && !error && activities.length === 0 && (
        <p className="empty-state">No activities logged yet.</p>
      )}
      {!loading && !error && activities.length > 0 && (
        <div className="table-responsive data-card">
          <table className="table align-middle mb-0">
            <thead><tr><th>Activity</th><th>Duration</th><th>Distance</th><th>Calories</th><th>Date</th></tr></thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id ?? `${activity.type}-${activity.recordedAt}`}>
                  <td className="fw-semibold text-capitalize">{activity.type ?? 'Activity'}</td>
                  <td>{activity.durationMinutes ?? '—'} min</td>
                  <td>{activity.distanceKm != null ? `${activity.distanceKm} km` : '—'}</td>
                  <td>{activity.calories != null ? `${activity.calories} kcal` : '—'}</td>
                  <td>{activity.recordedAt ? new Date(activity.recordedAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Activities
