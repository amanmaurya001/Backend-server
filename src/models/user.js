import mongoose from "mongoose";
import addressSchema from "./mod-adress.js";

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // 10-digit mobile number validation
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    addresses: [addressSchema],

    activeSessions: [
      {
        sessionId: { type: String, required: true },
        deviceInfo: { type: String },
        ipAddress: { type: String },
        loginTime: { type: Date, default: Date.now },
        lastActivity: { type: Date, default: Date.now },
      },
    ],

    loginHistory: [
      {
        sessionId: { type: String, required: true },
        deviceInfo: { type: String },
        ipAddress: { type: String },
        loginTime: { type: Date, default: Date.now },
        logoutTime: { type: Date },
        status: {
          type: String,
          enum: ["active", "logged_out", "expired"],
          default: "active",
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.model("User", usersSchema, "user");

export default User;
