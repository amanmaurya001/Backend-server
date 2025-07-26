import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SERCET_KEY;

export const isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedUserId = jwt.verify(token, JWT_SECRET);
    console.log(decodedUserId)
    req.user = decodedUserId.userId;
    next();
  } catch (err) {
    throw new Error("chal be nikal");
  }
};
