import { useEffect, useState } from 'react'
import { API_BASE_URL, collectionFromResponse, responseError } from '../api'

function Teams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadTeams() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/teams/`, {
          signal: controller.signal,
        })
        if (!response.ok) throw await responseError(response)
        setTeams(collectionFromResponse(await response.json()))
      } catch (loadError) {
        if (!controller.signal.aborted) setError(loadError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadTeams()
    return () => controller.abort()
  }, [])

  return (
    <section aria-labelledby="teams-heading">
      <div className="page-heading">
        <div>
          <p className="eyebrow">BETTER TOGETHER</p>
          <h1 id="teams-heading">Teams</h1>
          <p className="text-secondary mb-0">Find your crew and make every move count.</p>
        </div>
      </div>
      {loading && <p role="status">Loading teams…</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {!loading && !error && teams.length === 0 && (
        <p className="empty-state">No teams have joined yet.</p>
      )}
      {!loading && !error && teams.length > 0 && (
        <div className="row g-3">
          {teams.map((team) => (
            <div className="col-12 col-md-6" key={team._id ?? team.name}>
              <article className="data-card team-card h-100">
                <div className="team-mark" aria-hidden="true">{team.name?.charAt(0) ?? 'T'}</div>
                <h2>{team.name}</h2>
                <p className="text-secondary mb-3">
                  {team.members?.length ?? 0} {team.members?.length === 1 ? 'member' : 'members'}
                </p>
                <div className="team-points">{team.points ?? 0}<span> team points</span></div>
              </article>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Teams
