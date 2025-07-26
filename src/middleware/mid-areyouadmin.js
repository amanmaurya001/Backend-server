import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SERCET_KEY;
export const areYouAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decodedUserId = jwt.verify(token, JWT_SECRET);
    const searchingId = decodedUserId.userId;
    const checkRole = await User.findById(searchingId);
    if (checkRole.role === "admin") {
   
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (err) {
    throw new Error("mere ko chytiya samjhta h kya bc");
  }
};
