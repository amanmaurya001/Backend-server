import mongoose from "mongoose";
import addressSchema from "./mod-adress.js";

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/ // 10-digit mobile number validation
  },
   role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  addresses: [addressSchema] 
}, { versionKey: false, timestamps: true });

const User = mongoose.model("User", usersSchema, 'user');

export default User;
