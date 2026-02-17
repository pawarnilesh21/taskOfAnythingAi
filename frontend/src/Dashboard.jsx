// STEP 1: Import packages
import { useState, useEffect } from 'react'
import api from './services/api'
import AdminPanel from './AdminPanel'

// STEP 2: Dashboard component
export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks]         = useState([])
  const [form, setForm]           = useState({ title: '', description: '' })
  const [msg, setMsg]             = useState('')
  const [showAdmin, setShowAdmin] = useState(false) // toggle admin panel

  useEffect(() => { loadTasks(); }, [])

  const loadTasks = async () => {
    const res = await api.get('/tasks')
    setTasks(res.data.data)
  };

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000) }

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('/tasks', form)
    setForm({ title: '', description: '' })
    loadTasks();
    flash('Task created!')
  };

  const handleToggle = async (id, status) => {
    const newStatus = status === 'pending' ? 'completed' : 'pending'
    await api.put(`/tasks/${id}`, { status: newStatus })
    loadTasks()
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    await api.delete(`/tasks/${id}`)
    loadTasks()
    flash('Task deleted!')
  }

  // STEP 3: UI — header stays same, body switches between tasks and admin panel
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">Task Manager</h1>
          <p className="text-sm text-gray-500">
            {user.name} — <span className="capitalize">{user.role}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {/* Admin panel button — only visible if role is admin */}
          {user.role === 'admin' && (
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="bg-purple-600 text-white px-4 py-1 rounded text-sm"
            >
              {showAdmin ? 'My Tasks' : 'Admin Panel'}
            </button>
          )}
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {msg && <p className="text-sm text-green-600 bg-green-50 p-2 rounded">{msg}</p>}

        {/* If admin clicked Admin Panel — show AdminPanel component */}
        {showAdmin ? (
          <AdminPanel />
        ) : (
          <>
            {/* Create Task Form */}
            <div className="bg-white p-5 rounded shadow">
              <h2 className="font-semibold mb-3">Add Task</h2>
              <form onSubmit={handleCreate} className="space-y-2">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Title"
                  required
                  className="w-full border p-2 rounded"
                />
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full border p-2 rounded"
                />
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Add
                </button>
              </form>
            </div>

            {/* Task List */}
            <div className="bg-white p-5 rounded shadow">
              <h2 className="font-semibold mb-3">My Tasks ({tasks.length})</h2>

              {tasks.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No tasks yet</p>
              )}

              {tasks.map((task) => (
                <div key={task._id} className="border rounded p-3 mb-2 flex justify-between items-start">
                  <div>
                    <p className={task.status === 'completed' ? 'line-through text-gray-400' : 'font-medium'}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                    )}
                    <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded ${
                      task.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => handleToggle(task._id, task.status)}
                      className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                    >
                      {task.status === 'pending' ? 'Complete' : 'Reopen'}
                    </button>

                    {/* Delete only for admin */}
                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
