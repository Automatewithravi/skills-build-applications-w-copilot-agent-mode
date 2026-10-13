import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'
import './App.css'

function App() {
  const navigation = [
    { label: 'Athletes', path: '/users' },
    { label: 'Activities', path: '/activities' },
    { label: 'Teams', path: '/teams' },
    { label: 'Leaderboard', path: '/leaderboard' },
    { label: 'Workouts', path: '/workouts' },
  ]

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/users" aria-label="OctoFit home">
          <img src={logo} alt="" />
          <span>octofit<span className="brand-dot">.</span></span>
        </NavLink>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <span className="topbar-caption">MOVE WITH PURPOSE</span>
      </header>
      <main className="main-content">
        <div className="welcome-banner">
          <div>
            <p className="eyebrow">OCTOFIT TRACKER</p>
            <p className="welcome-copy">Small steps. Stronger together.</p>
          </div>
          <span className="welcome-icon" aria-hidden="true">✳</span>
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </main>
      <footer className="footer">Built for progress, not perfection.</footer>
    </div>
  )
}

export default App
