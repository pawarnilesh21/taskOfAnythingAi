import { useState, useEffect } from 'react'
import Auth from './Auth'
import Dashboard from './Dashboard'

export default function App() {
  const [user, setUser] = useState(null)

  // Check saved login on page load
  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const handleLogin = (userData) => setUser(userData)
  const handleLogout = () => { localStorage.clear(); setUser(null); }

  return user
    ? <Dashboard user={user} onLogout={handleLogout} />
    : <Auth onLogin={handleLogin} />
}