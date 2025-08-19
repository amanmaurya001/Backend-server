import Cart from "../models/mod-cart.js";
import Product from "../models/product.js";
import Order from "../models/mod-orders.js";
import User from "../models/user.js"
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 



/**
 * ======================================================
 * CREATE CART / ADD TO CART
 * ------------------------------------------------------
 */
export const createCart = async (req, res) => {
  try {
    // Request body se data lena
    const { productId, quantity, size } = req.body;
    const cartId = req.user; // Logged-in user ka ID

    // Check if cart exists
    const cart = await Cart.findOne({ cartId });

    if (cart) {
      // Check if same product + size already exists
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId && item.size === size
      );

      if (existingItem) {
        // Update quantity agar same product+size mil gaya
        existingItem.quantity += quantity || 1;
      } else {
        // Naya product cart me add karo
        cart.items.push({ productId, quantity: quantity || 1, size });
      }

      // Cart save karo
      await cart.save();
    } else {
      // Naya cart create karo agar user ka cart hi nahi hai
      await Cart.create({
        cartId,
        items: [{ productId, quantity: quantity || 1, size }],
      });
    }

    // Success response
    res.status(201).json({ message: "item added to cart successfully" });

  } catch (error) {
    // Error handling
    console.error("Error in createCart:", error);
    res.status(500).json({
      message: "Server error while adding item to cart.",
      error: error.message,
    });
  }
};

/**
 * ======================================================
 * SHOW CART
 * ------------------------------------------------------
 * User ke cart ka detail return karta hai:
 * - Products list (quantity, size, price, image)
 * - Order summary (subtotal, discount, delivery charges, total)
 * Agar cart empty ho to empty array + zero summary deta hai.
 * ======================================================
 */
export const showCart = async (req, res) => {
  try {
    let subtotal = 0;
    const cartId = req.user; // Logged-in user ka ID

    // User ka cart find karo
    const cartUserObj = await Cart.findOne({ cartId });

    // Agar cart empty hai ya exist nahi karta
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

    // Cart me jitne product IDs hai wo collect karo
    const productIds = cartUserObj.items.map((item) => item.productId);

    // Un products ka data fetch karo
    const products = await Product.find({ _id: { $in: productIds } });

    // Final cart array banate hue subtotal calculate karo
    const finalCart = cartUserObj.items.map((cartItem) => {
      const product = products.find(
        (p) => p._id.toString() === cartItem.productId.toString()
      );

      // Price * Quantity
      const itemTotal = (product?.price?.original || 0) * cartItem.quantity;
      subtotal += itemTotal;

      return {
        itemId: cartItem._id,
        productId: product?.id,
        size: cartItem.size,
        quantity: cartItem.quantity,
        name: product?.name,
        price: product?.price,
        image: product?.images?.[0],
       
      };
    });

    // Summary calculation
    const discount = subtotal * 0.1; // 10% discount
    const deliveryCharge = subtotal >= 2500 ? 0 : 100; // Free delivery above ₹2500
    const total = subtotal - discount + deliveryCharge;

    // Response send karo
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
    console.error("Error in showCart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * ======================================================
 * DELETE CART ITEM
 * ------------------------------------------------------
 * User ke cart se ek specific product remove karta hai.
 * Agar product na mile to 404 return karega.
 * ======================================================
 */
export const deleteCartItem = async (req, res) => {
  try {
    const cartId = req.user; // Logged-in user ka ID
    const { itemId } = req.params; // Cart item ka ID (MongoDB _id)

    // Cart se matching _id wala item remove karo
    const result = await Cart.updateOne(
      { cartId },
      { $pull: { items: { _id: itemId } } }
    );

    // Agar koi item remove nahi hua
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Item not found or already removed" });
    }

    // Success
    res.status(200).json({ message: "Item removed successfully" });

  } catch (error) {
    console.error("Error deleting cart item:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};






export const createCheckoutSession = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;
    const cartId = req.user;

    console.log("📥 Payment Method Received:", paymentMethod);

    // 1️⃣ Get User & Address
    const user = await User.findById(cartId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const selectedAddress = user.addresses.find(
      (addr) => addr._id.toString() === addressId
    );
    if (!selectedAddress) return res.status(400).json({ message: "Address not found" });

    // 2️⃣ Get Cart
    const cartUserObj = await Cart.findOne({ cartId });
    if (!cartUserObj || cartUserObj.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 3️⃣ Fetch Products & Calculate Order Details (subtotal, etc.)
    const productIds = cartUserObj.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of cartUserObj.items) {
      const product = products.find(
        (p) => p._id.toString() === cartItem.productId.toString()
      );
      if (!product) continue;

      const basePrice = product.price?.original || 0;
      const unitPrice = Math.round(basePrice);
      const itemTotal = unitPrice * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        size: cartItem.size,
        quantity: cartItem.quantity,
        price: unitPrice,
      });
    }

    const discount = Math.round(subtotal * 0.1);
    const deliveryCharge = subtotal >= 2500 ? 0 : 100;
    const total = subtotal - discount + deliveryCharge;

    // 4️⃣ COD Flow: Save to DB, skip Stripe
    if (paymentMethod?.toLowerCase() === "cod") {
      console.log("💰 COD selected, skipping Stripe.");

      const newOrder = new Order({
        cartId,
        email: user.email,
        paymentMethod: "cod",
        paymentStatus: "pending",
        items: orderItems,
        address: selectedAddress,
        subtotal,
        discount,
        delivery: deliveryCharge,
        total,
        createdAt: new Date(),
      });

      await newOrder.save();
      await Cart.deleteOne({ cartId });

      return res.status(200).json({
        message: "Order placed with Cash on Delivery",
        cod: true,
      });
    }

    // 5️⃣ Stripe Flow: Prepare line_items & create session
    const line_items = [];

    for (const item of orderItems) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name} (Size: ${item.size})`,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      });
    }

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
        landmark: selectedAddress.landmark || "",
        paymentMethod: paymentMethod || "card",
      },
      success_url: "http://localhost:5173/",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error in Checkout:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};






