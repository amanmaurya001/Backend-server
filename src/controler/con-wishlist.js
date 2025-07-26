import Product from "../models/product.js";
import jwt from "jsonwebtoken";
import Wishlist from "../models/mod-wishlist.js";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SERCET_KEY;

export const createWishList = async (req, res) => {
  const { productId } = req.body;

 
  const wishId = req.user;

  const wishlistuserObj = await Wishlist.findOne({ wishListId: wishId });

  if (wishlistuserObj) {
    const existingItem = wishlistuserObj.items.find(
      (wish) => wish.productId.toString() === productId.toString()
    );
    if (existingItem) {
      return res.status(200).json({ message: "Item already in wishlist" });
    } else {
      wishlistuserObj.items.push({ productId });
      await wishlistuserObj.save();
      return res.status(201).json({ message: "Item added to wishlist" });
    }
  } else {
    // Create new cart
    await Wishlist.create({
      wishListId: wishId,
      items: [{ productId }],
    });
  }

  res.status(201).json({ message: "item added to cart successfully" });
};








export const showWishList = async (req, res) => {
  try {
   
    const wishid = req.user;
    const wishListUserObj = await Wishlist.findOne({ wishListId: wishid });
    console.log(wishListUserObj);
    if (!wishListUserObj || wishListUserObj.items.length === 0) {
      return res.status(200).json({ items: [] }); // empty cart
    }
    const itemDetails = wishListUserObj.items;
    const productIds = wishListUserObj.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const finalWishList = itemDetails.map((item) => {
      const product = products.find(
        (p) => String(p._id) === String(item.productId)
      );
      return {
        wishlistItemId: item._id, // <- wishlist item ka _id
        productId: item.productId,
        size: item.size, // <- agar koi aur field ho to
        color: item.color,
        name: product?.name,
        price: product?.price,
        image: product?.images?.[0],
        link: product?.link,
      };
    });
    res.status(200).json({ items: finalWishList });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};












export const deletewishItem = async (req, res) => {
  try {
  
    const wishId = req.user;

    // 3. Get itemId from params
    const { itemId } = req.params;

    // 4. Pull the item from cart's items array
    const result = await Wishlist.updateOne(
      {  wishListId:wishId },
      { $pull: { items: { _id: itemId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Item not found or already removed" });
    }

    res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};