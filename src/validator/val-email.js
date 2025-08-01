export const secureEmailValidator = (req, res, next) => {
  let { requestedEmail } = req.body;

  if (!requestedEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  requestedEmail = requestedEmail.toString().trim().toLowerCase();

  // Remove any HTML/script tags
  const cleanEmail = requestedEmail.replace(/<[^>]*>?/gm, "");

  // Check for common malicious patterns
  const maliciousPatterns = [/<script.*?>.*?<\/script>/gi, /['";`]/g, /--/g, /union\s+select/gi];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(cleanEmail)) {
      return res.status(400).json({ message: "Malicious input detected in email" });
    }
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Final sanitized + validated email
  req.body.requestedEmail = cleanEmail;
  next();
};
