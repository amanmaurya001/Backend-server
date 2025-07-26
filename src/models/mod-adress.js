import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{6}$/ // Indian pincode validation
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  block: {
    type: String,
    required: true,
    trim: true
  },
  locality: {
    type: String,
    required: true,
    trim: true
  },
  landmark: {
    type: String,
    trim: true,
    default: ""
  },
  addressType: {
    type: String,
    enum: ["Home", "Work", "Other"],
    default: "Home"
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { 

  timestamps: false // disable timestamps for sub-documents
});

export default addressSchema;