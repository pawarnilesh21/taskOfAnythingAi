// STEP 1: Import required packages
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import taskRoutes from './routes/tasks.js'
import adminRoutes from './routes/admin.js' 

// Load environment variables
dotenv.config()

// STEP 2: Initialize Express app and connect database
const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// STEP 3: Apply middleware
app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow only frontend URL
  credentials: true
}))
app.use(express.json()) // Parse JSON request body

// API Routes with versioning
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/tasks', taskRoutes)
app.use('/api/v1/admin', adminRoutes) 

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Backend API is running',
    version: 'v1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      tasks: '/api/v1/tasks'
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
})