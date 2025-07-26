import Newsletter from "../models/mod-newsletter.js";

export const createNewsletter = async (req, res) => {
  try {
    const { requestedEmail } = req.body;
    const normalizedEmail = requestedEmail.toLowerCase().trim();

    const emailCheck = await Newsletter.findOne({
      Newsletter_emails: normalizedEmail,
    });

    if (emailCheck) {
      return res.status(409).json({ message: "Email already exist " });
    } 
      await Newsletter.create({  Newsletter_emails: normalizedEmail });
      res.status(201).json({ message: "You subscribed successfully" });
  
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
