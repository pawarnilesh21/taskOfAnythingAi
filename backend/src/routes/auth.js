// STEP 1: Import required packages and models
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'

const router = express.Router()

// STEP 2: Register new user route
router.post('/register',
  // Validate input data
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { name, email, password, role } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered' 
        })
      }

      // Create new user (password will be hashed automatically by model)
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user' // Default to 'user' if not specified
      })

      // Send success response (don't send password)
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
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

// STEP 3: Login user route
router.post('/login',
  // Validate input
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
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

      const { email, password } = req.body

      // Find user by email
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        })
      }

      // Compare password with hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        })
      }

      // Create JWT token with user data
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
      )

      // Send success response with token
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      })

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      })
    }
  }
);

export default router