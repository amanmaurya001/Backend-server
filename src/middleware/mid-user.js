import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SERCET_KEY;

export const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "Please login to continue" });
    }

    const decodedUserId = jwt.verify(token, JWT_SECRET);

    req.user = decodedUserId.userId;
    req.session = decodedUserId.sessionId;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
