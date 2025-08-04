import rateLimit from 'express-rate-limit';

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
  keyGenerator: (req) => {
    return `register-${req.ip}`;
  },
  handler: (req, res) => {
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Too many registration attempts. Please try again after ${remainingTime} minutes.`,
      retryAfter: remainingTime + " minutes"
    });
  }
});

// Login Rate Limiter - Strict
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 login attempts per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const username = req.body?.username || 'unknown';
    return `login-${req.ip}-${username}`;
  },
  handler: (req, res) => {
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Too many login attempts. Please try again after ${remainingTime} minutes.`,
      retryAfter: remainingTime + " minutes"
    });
  }
});