import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  cartId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["card", "upi", "cod"],
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      name: String,
      size: String,
      quantity: Number,
      price: Number,
    },
  ],
  address: {
    fullName: String,
    mobile: String,
    pincode: String,
    city: String,
    state: String,
    block: String,
    locality: String,
    landmark: String,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  delivery: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed"],
    default: "pending", // for COD
  },
  stripeSessionId: String, // only for Stripe orders
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema, "orders");
