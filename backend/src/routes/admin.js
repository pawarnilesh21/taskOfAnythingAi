// STEP 1: Import packages
import express from 'express'
import User from '../models/User.js'
import Task from '../models/Task.js'
import { verifyToken, isAdmin } from '../middleware/auth.js'

const router = express.Router();

// STEP 2: Get all users — admin only
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    // Fetch all users but hide password field
    const users = await User.find().select('-password')
    res.status(200).json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// STEP 3: Get all tasks from all users — admin only
router.get('/tasks', verifyToken, isAdmin, async (req, res) => {
  try {
    // populate brings user name and email from User model
    const tasks = await Task.find().populate('userId', 'name email')
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router