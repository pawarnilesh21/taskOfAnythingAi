// STEP 1: Import mongoose for MongoDB connection
import mongoose from 'mongoose'

// STEP 2: Create database connection function
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`)
    process.exit(1); // Exit process if connection fails
  }
};

// STEP 3: Export the connection function
export default connectDB