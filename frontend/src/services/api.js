// STEP 1: Import axios for HTTP requests
import axios from 'axios'

// STEP 2: Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// STEP 3: Add token to all requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api