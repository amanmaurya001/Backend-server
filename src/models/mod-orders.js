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
      price: Number, // ₹ in rupees
    },
  ],
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
    default: "paid",
  },
  stripeSessionId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema, "orders");
