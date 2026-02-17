import { useState } from 'react'
import api from './services/api'

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [msg, setMsg] = useState({ text: '', ok: true })

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email: form.email, password: form.password } : form
      const res = await api.post(endpoint, body)

      if (isLogin) {
        localStorage.setItem('token', res.data.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.data.user))
        onLogin(res.data.data.user)
      } else {
        setMsg({ text: 'Registered! Please login.', ok: true })
        setTimeout(() => setIsLogin(true), 1500)
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Something went wrong', ok: false })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-5">{isLogin ? 'Login' : 'Register'}</h2>

        {msg.text && (
          <p className={`mb-4 text-sm ${msg.ok ? 'text-green-600' : 'text-red-500'}`}>
            {msg.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input name="name" placeholder="Full Name" onChange={update}
              className="w-full border p-2 rounded" required />
          )}
          <input name="email" type="email" placeholder="Email" onChange={update}
            className="w-full border p-2 rounded" required />
          <input name="password" type="password" placeholder="Password" onChange={update}
            className="w-full border p-2 rounded" required minLength={6} />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          {isLogin ? "No account? " : "Have account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}