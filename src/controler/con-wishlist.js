import Product from "../models/product.js";

import Wishlist from "../models/mod-wishlist.js";
import dotenv from "dotenv";
dotenv.config();


export const createWishList = async (req, res) => {
  try {
    // Request body se productId lete hain
    const { productId } = req.body;

    // Logged-in user ka ID (middleware se set hua hoga)
    const wishId = req.user;

    // User ka wishlist object find karte hain
    const wishlistuserObj = await Wishlist.findOne({ wishListId: wishId });

    // Agar wishlist already exist karta hai
    if (wishlistuserObj) {
      // Check karo ki product already wishlist me to nahi hai
      const existingItem = wishlistuserObj.items.find(
        (wish) => wish.productId.toString() === productId.toString()
      );

      if (existingItem) {
        // Product pehle se wishlist me hai
        return res.status(200).json({ message: "Item already in wishlist" });
      } else {
        // Wishlist me naye product ko push karo
        wishlistuserObj.items.push({ productId });
        await wishlistuserObj.save();
        return res.status(201).json({ message: "Item added to wishlist" });
      }

    } else {
      // Agar wishlist hi nahi hai, to nayi wishlist create karo
      await Wishlist.create({
        wishListId: wishId,
        items: [{ productId }],
      });
    }

    // Final success response (nayi wishlist create hone ke baad)
    res.status(201).json({ message: "Item added to wishlist successfully" });

  } catch (err) {
    // Server-side error log
    console.error("Error creating wishlist:", err);

    // Internal server error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message // Optional: debug ke liye
    });
  }
};









export const showWishList = async (req, res) => {
  try {
    // Logged-in user ka ID (JWT se middleware me attach hua hoga)
    const wishid = req.user;

    // User ka wishlist object find karte hain wishlist collection se
    const wishListUserObj = await Wishlist.findOne({ wishListId: wishid });

    // Agar wishlist hi nahi hai ya items empty hain, toh empty array return karo
    if (!wishListUserObj || wishListUserObj.items.length === 0) {
      return res.status(200).json({ items: [] });
    }

    // Wishlist me jo items hain unki list lete hain
    const itemDetails = wishListUserObj.items;

    // Product IDs extract karte hain taaki Product collection se details nikaal saken
    const productIds = wishListUserObj.items.map((item) => item.productId);

    // Product collection me se matching products fetch karo
    const products = await Product.find({ _id: { $in: productIds } });

    // Final wishlist banate hain with product details
    const finalWishList = itemDetails.map((item) => {
      // Current wishlist item ke liye matching product find karo
      const product = products.find(
        (p) => String(p._id) === String(item.productId)
      );

      return {
        wishlistItemId: item._id, // Wishlist item ka unique _id (wishlist ke andar ka item)
        productId: product?.id, // Product ka ID
        size: item.size,           // User-selected size (agar available)
        color: item.color,         // User-selected color (agar available)
        name: product?.name,       // Product ka naam
        price: product?.price,     // Product ka price
        image: product?.images?.[0] // Pehla image (agar available)
      };
    });

    // Successfully wishlist data bhej do
    res.status(200).json({ items: finalWishList });

  } catch (err) {
    console.error("Error showing wishlist:", err); // Debug ke liye error log
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message // Optional: client ko basic error detail dena
    });
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