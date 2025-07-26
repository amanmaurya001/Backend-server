import rateLimit from 'express-rate-limit';

export const newsletterLimiter = rateLimit({
   windowMs: 24 * 60 * 60 * 1000, // 1 din
  max: 3, // limit each IP to 5 requests per window
  message: {
    status: 429,
    message: "Too many newsletter requests. Please try again later.",
  },
});
