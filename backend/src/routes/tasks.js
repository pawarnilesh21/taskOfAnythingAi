// STEP 1: Import required packages and models
import express from 'express'
import { body, validationResult } from 'express-validator'
import Task from '../models/Task.js'
import { verifyToken, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// STEP 2: CRUD Operations for Tasks

// GET all tasks (protected route - requires login)
router.get('/', verifyToken, async (req, res) => {
  try {
    // Get all tasks for logged-in user
    const tasks = await Task.find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    })

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
})

// POST create new task (protected route)
router.post('/',
  verifyToken,
  [
    body('title').trim().notEmpty().withMessage('Task title is required')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        })
      }

      const { title, description } = req.body

      // Create new task linked to logged-in user
      const task = await Task.create({
        title,
        description,
        userId: req.user.id
      })

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      })

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      })
    }
  }
)

// PUT update task (protected route)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, status } = req.body

    // Find task by ID and check if it belongs to user
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    })

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found or unauthorized' 
      })
    }

    // Update task fields
    if (title) task.title = title
    if (description !== undefined) task.description = description
    if (status) task.status = status

    await task.save()

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    })

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
});

// DELETE task (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    // Find and delete task
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      })
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    })

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
})

// STEP 3: Export router
export default router