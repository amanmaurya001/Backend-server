import Cart from "../models/mod-cart.js";
import Product from "../models/product.js";
import Order from "../models/mod-orders.js";
import User from "../models/user.js"
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

const JWT_SECRET = process.env.JWT_SERCET_KEY;

export const createCart = async (req, res) => {
  const { productId, quantity, size } = req.body;

  const cartId = req.user;

  const cart = await Cart.findOne({ cartId });

  if (cart) {
    // Check if product with same size already exists in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingItem) {
      // Update quantity if product with same size exists
      existingItem.quantity += quantity || 1;
    } else {
      // Add new item to cart
      cart.items.push({ productId, quantity: quantity || 1, size });
    }

    await cart.save();
  } else {
    // Create new cart
    await Cart.create({
      cartId,
      items: [{ productId, quantity: quantity || 1, size }],
    });
  }

  res.status(201).json({ message: "item added to cart successfully" });
};

export const showCart = async (req, res) => {
  try {
    let subtotal = 0;
    const cartId = req.user;
    const cartUserObj = await Cart.findOne({ cartId });
    if (!cartUserObj || cartUserObj.items.length === 0) {
      return res.status(200).json({
        items: [],
        summary: {
          subtotal: 0,
          discount: 0,
          deliveryCharge: 0,
          total: 0,
        },
      });
    }

    const productIds = cartUserObj.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const finalCart = cartUserObj.items.map((cartItem) => {
      const product = products.find(
        (p) => p._id.toString() === cartItem.productId.toString()
      );
      const itemTotal = (product?.price?.original || 0) * cartItem.quantity;
      subtotal += itemTotal;
      return {
        itemId: cartItem._id,
        productId: cartItem.productId,
        size: cartItem.size,
        quantity: cartItem.quantity,
        name: product?.name,
        price: product?.price,
        image: product?.images?.[0],
        productLink: product?.productLink,
      };
    });
    const discount = subtotal * 0.1;
    const deliveryCharge = subtotal >= 2500 ? 0 : 100;
    const total = subtotal - discount + deliveryCharge;

    res.status(200).json({
      items: finalCart,
      summary: {
        subtotal: Math.round(subtotal),
        discount: Math.round(discount),
        deliveryCharge,
        total: Math.round(total),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const cartId = req.user;

    // 3. Get itemId from params
    const { itemId } = req.params;

    // 4. Pull the item from cart's items array
    const result = await Cart.updateOne(
      { cartId },
      { $pull: { items: { _id: itemId } } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Item not found or already removed" });
    }

    res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};






export const createCheckoutSession = async (req, res) => {
  try {
    const { addressId } = req.body;
    const cartId = req.user; // from auth middleware (user._id)
     console.log(cartId);
    // 🟢 1. Find full user
    const user = await User.findById(cartId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🟢 2. Find selected address from user.addresses
    const selectedAddress = user.addresses.find(
      (addr) => addr._id.toString() === addressId
    );

    if (!selectedAddress) {
      return res.status(400).json({ message: "Address not found in user" });
    }

    // 🛒 3. Get cart
    const cartUserObj = await Cart.findOne({ cartId });

    if (!cartUserObj || cartUserObj.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 🛍️ 4. Get products & prepare line items
    const productIds = cartUserObj.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    let subtotal = 0;
    const line_items = [];

    for (const cartItem of cartUserObj.items) {
      const product = products.find(
        (p) => p._id.toString() === cartItem.productId.toString()
      );
      if (!product) continue;

      const basePrice = product.price?.original || 0;
      const safeUnitPrice = Math.round(basePrice);
      const itemTotal = safeUnitPrice * cartItem.quantity;
      subtotal += itemTotal;

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${product.name} (Size: ${cartItem.size})`,
          },
          unit_amount: safeUnitPrice * 100,
        },
        quantity: cartItem.quantity,
      });
    }

    // 🚚 5. Delivery & Discount
    const discount = subtotal * 0.1;
    const deliveryCharge = subtotal >= 2500 ? 0 : 100;

    if (deliveryCharge > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Delivery Charge" },
          unit_amount: deliveryCharge * 100,
        },
        quantity: 1,
      });
    }

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Discount Applied (10%)" },
        unit_amount: 0,
      },
      quantity: 1,
    });
    console.log("✅ Selected Address being sent to Stripe metadata:", selectedAddress);
    // 💳 6. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      client_reference_id: cartId,
      metadata: {
      
        fullName: selectedAddress.fullName,
        mobile: selectedAddress.mobile,
        pincode: selectedAddress.pincode,
        city: selectedAddress.city,
        state: selectedAddress.state,
        block: selectedAddress.block,
        locality: selectedAddress.locality,
        landmark: selectedAddress.landmark || "", // safe for undefined
      },
      success_url: "http://localhost:5173/",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







