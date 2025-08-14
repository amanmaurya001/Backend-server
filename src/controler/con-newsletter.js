import Newsletter from "../models/mod-newsletter.js";

export const createNewsletter = async (req, res) => {
  try {
    const { requestedEmail } = req.body;
    const normalizedEmail = requestedEmail.toLowerCase().trim();

    // Check if email already exists
    const emailCheck = await Newsletter.findOne({ Newsletter_emails: normalizedEmail });

    if (emailCheck) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Create new newsletter subscription
    await Newsletter.create({ Newsletter_emails: normalizedEmail });
    return res.status(201).json({ message: "You subscribed successfully" });

  } catch (error) {
    console.error("Newsletter subscription error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
