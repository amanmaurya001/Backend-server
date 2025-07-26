import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    Newsletter_emails: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Newsletter = mongoose.model("Newsletter", newsletterSchema,'newletters');

export default Newsletter;
