// STEP 1: Import JWT package
import jwt from 'jsonwebtoken'

// STEP 2: Create middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header (format: "Bearer token")
    const token = req.headers.authorization?.split(' ')[1]
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      })
    }
    
    // Verify token and extract user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded; // Add user info to request object
    
    next(); // Continue to next middleware/route
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    })
  }
};

// STEP 3: Create middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  // Check if user role is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin only.' 
    });
  }
  next()
}