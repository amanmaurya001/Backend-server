import { rateLimit, ipKeyGenerator } from "express-rate-limit";

// Register Rate Limiter - Very Strict
export const registerRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Maximum 3 registration attempts per 15 minutes
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after 15 minutes.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  // ✅ FIXED HERE
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req); // ✅ Correctly handles IPv4 and IPv6
    return `register-${ip}`;
  },

  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime || new Date(Date.now() + 15 * 60 * 1000);
    const remainingTime = Math.ceil((resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Too many registration attempts. Please try again after ${remainingTime} minutes.`,
      retryAfter: `${remainingTime} minutes`
    });
  }
});

// Login Rate Limiter - Strict
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,


  keyGenerator: (req) => {
    const username = req.body?.username || "unknown";
    const ip = ipKeyGenerator(req); // ✅ Safe for IPv6
    return `login-${ip}-${username}`;
  },

  // Optional: Better error message
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime || new Date(Date.now() + 15 * 60 * 1000);
    const remainingTime = Math.ceil((resetTime - Date.now()) / 1000 / 60);
    return res.status(429).json({
      success: false,
      message: `Too many login attempts. Try again after ${remainingTime} minutes.`,
    });
  }
});