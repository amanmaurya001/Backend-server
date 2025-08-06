import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SERCET_KEY;
export const getRegister = async (req, res) => {
  const { username, email, password, gender, dob, phone } = req.body;

  const user = await User.findOne({ username });
  if (user) {
    throw new Error("username already exist ");
  }

  const hash = await bcrypt.hash(password, 12);

  await User.create({
    username,
    email,
    password: hash,
    gender,
    dob: dob || undefined,
    phone: phone || undefined,
  });

  res.status(201).json({ message: "user register sucesfully" });
};

export const getLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("username or password is inncorect");
  }

  const ispasswordValid = await bcrypt.compare(password, user.password);
  if (!ispasswordValid) {
    throw new Error("username or password is inncorect");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({ token: token });
};





export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user;

    const user = await User.findById( userId );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

