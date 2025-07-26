import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema(
  {
    wishListId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Wishlist", wishListSchema, "wishlists");
