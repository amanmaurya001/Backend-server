import jwt from "jsonwebtoken"
import User from "../models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SERCET_KEY;
export const getRegister = async (req, res) => {
  const { username, email, password, gender, dob, phone  } = req.body;

  const user = await User.findOne({ username });
  if (user) {
    throw new Error("username already exist ");
  }

  const hash = await bcrypt.hash(password, 12);

  await User.create({ username, email, password: hash, gender, dob: dob || undefined,  phone: phone || undefined });

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
    role: user.role
  },
  JWT_SECRET,
  { expiresIn: "1d" }
);

  res.status(200).json({ token: token });
};

