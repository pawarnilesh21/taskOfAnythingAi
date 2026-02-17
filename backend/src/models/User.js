// STEP 1: Import required packages
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// STEP 2: Define User Schema with validation
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Only these two roles allowed
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// STEP 3: Hash password before saving to database
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return next()
  
  // Hash password with 10 rounds of salt
  this.password = await bcrypt.hash(this.password, 10)
  next()
});

export default mongoose.model('User', userSchema)