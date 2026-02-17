// STEP 1: Import mongoose
import mongoose from 'mongoose'

// STEP 2: Define Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'], 
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
//export
export default mongoose.model('Task', taskSchema)