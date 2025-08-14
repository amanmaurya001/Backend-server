import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SERCET_KEY;
// =========================
// Register Controller
// =========================
export const getRegister = async (req, res) => {
  try {
    const { username, email, password, gender, dob, phone } = req.body;

    // Basic validation
    if (!username || !email || !password || !gender) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Create user
    await User.create({
      username,
      email,
      password: hash,
      gender,
      dob: dob || undefined,
      phone: phone || undefined,
    });

    return res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (err) {
    console.error("Register Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};






// =========================
// Login Controller
// =========================
export const getLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // return res.status(200).json({ success: true, token });
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    
    return res.status(200).json({ success: true, user: { username: user.username } });

  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// =========================
// Authentication Check Controller
// =========================

export const checkAuth = async (req, res) => {
  try {
    // Cookie se token get karo
    const token = req.cookies.authToken;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }
    
    // Token verify karo
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // User find karo (password exclude karo)
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
    
  } catch (err) {
    // Token invalid/expired
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired" 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }
    
    console.error("Auth Check Error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};


// =========================
// Logout Controller (Bonus)
// =========================

export const logout = async (req, res) => {
  try {
    // Cookie clear karo
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    return res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
    
  } catch (err) {
    console.error("Logout Error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// =========================
// Change Password 
// =========================

export const changePassword = async (req, res) => {
  try {
    // Extract required fields from request body
    const { currentPassword, newPassword, confirmPassword } = req.body;
    // User ID middleware se aata hai (JWT verify ke baad)
    const userId = req.user;

    // Step 1: Basic field validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Step 2: Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 3: Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Step 4: Check if new password matches confirmation password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    // Step 5: Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 6: Update password in database
    user.password = hashedPassword;
    await user.save();

    // Step 7: Success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    // Server error handling
    console.error("Change password error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating password",
    });
  }
};


