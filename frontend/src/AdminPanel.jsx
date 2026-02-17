// STEP 1: Import packages
import { useState, useEffect } from 'react'
import api from './services/api'

// STEP 2: Fetch all users and all tasks from admin routes
export default function AdminPanel() {
  const [users, setUsers]     = useState([])
  const [tasks, setTasks]     = useState([])
  const [msg,   setMsg]       = useState('')

  useEffect(() => {
    loadUsers()
    loadTasks()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data.data)
    } catch {
      setMsg('Failed to load users')
    }
  }

  const loadTasks = async () => {
    try {
      const res = await api.get('/admin/tasks')
      setTasks(res.data.data)
    } catch {
      setMsg('Failed to load tasks')
    }
  }

  // STEP 3: Delete any task as admin
  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${id}`)
      loadTasks()
    } catch {
      setMsg('Failed to delete task')
    }
  }

  return (
    <div className="space-y-6">
      {msg && <p className="text-sm text-red-500">{msg}</p>}

      {/* All Users */}
      <div className="bg-white p-5 rounded shadow">
        <h2 className="font-semibold mb-3">All Users ({users.length})</h2>
        {users.length === 0 && <p className="text-gray-400 text-sm">No users found</p>}
        {users.map((u) => (
          <div key={u._id} className="border rounded p-3 mb-2 flex justify-between items-center">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {u.role}
            </span>
          </div>
        ))}
      </div>

      {/* All Tasks */}
      <div className="bg-white p-5 rounded shadow">
        <h2 className="font-semibold mb-3">All Tasks ({tasks.length})</h2>
        {tasks.length === 0 && <p className="text-gray-400 text-sm">No tasks found</p>}
        {tasks.map((task) => (
          <div key={task._id} className="border rounded p-3 mb-2 flex justify-between items-start">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                By: {task.userId?.name || 'Unknown'}
              </p>
              <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded ${
                task.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {task.status}
              </span>
            </div>
            <button
              onClick={() => handleDelete(task._id)}
              className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}