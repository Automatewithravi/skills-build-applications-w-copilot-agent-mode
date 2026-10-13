import { useEffect, useState } from 'react'
import { API_BASE_URL, collectionFromResponse, responseError } from '../api'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadWorkouts() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/workouts/`, {
          signal: controller.signal,
        })
        if (!response.ok) throw await responseError(response)
        setWorkouts(collectionFromResponse(await response.json()))
      } catch (loadError) {
        if (!controller.signal.aborted) setError(loadError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadWorkouts()
    return () => controller.abort()
  }, [])

  return (
    <section aria-labelledby="workouts-heading">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR NEXT SESSION</p>
          <h1 id="workouts-heading">Workouts</h1>
          <p className="text-secondary mb-0">Ideas to keep your momentum going.</p>
        </div>
      </div>
      {loading && <p role="status">Loading workouts…</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {!loading && !error && workouts.length === 0 && (
        <p className="empty-state">No workouts available yet.</p>
      )}
      {!loading && !error && workouts.length > 0 && (
        <div className="row g-3">
          {workouts.map((workout) => (
            <div className="col-12 col-md-6" key={workout._id ?? workout.title}>
              <article className="data-card workout-card h-100">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <span className="activity-tag">{workout.activityType}</span>
                  <span className="difficulty-tag">{workout.difficulty}</span>
                </div>
                <h2>{workout.title}</h2>
                <p className="text-secondary">{workout.description}</p>
                <p className="small fw-semibold">{workout.durationMinutes} minutes</p>
                {workout.exercises?.length > 0 && (
                  <ul className="exercise-list">
                    {workout.exercises.map((exercise) => <li key={exercise}>{exercise}</li>)}
                  </ul>
                )}
              </article>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Workouts
