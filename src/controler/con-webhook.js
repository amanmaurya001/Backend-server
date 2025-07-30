import Stripe from "stripe";
import Cart from "../models/mod-cart.js";
import Product from "../models/product.js";
import Order from "../models/mod-orders.js";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const cartId = session.client_reference_id;
    const email = session.customer_details?.email || "unknown";

    try {
      const cart = await Cart.findOne({ cartId });
      if (!cart || cart.items.length === 0) {
        console.warn("🛒 Cart not found or empty:", cartId);
        return res.status(400).send("Cart not found or empty");
      }

      const productIds = cart.items.map((item) => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });

      let subtotal = 0;
      const orderItems = [];

      for (const item of cart.items) {
        const product = products.find(
          (p) => p._id.toString() === item.productId.toString()
        );
        if (!product) continue;

        const basePrice = product.price?.original || 0;
        const totalPrice = basePrice * item.quantity;
        subtotal += totalPrice;

        orderItems.push({
          productId: product._id,
          name: product.name,
          size: item.size,
          quantity: item.quantity,
          price: basePrice,
        });
      }

      const discount = Math.round(subtotal * 0.1);
      const delivery = subtotal >= 2500 ? 0 : 100;
      const total = subtotal - discount + delivery;

      // ✅ Extract full address from session metadata
      const address = {
        _id: session.metadata.addressId,
        fullName: session.metadata.fullName,
        mobile: session.metadata.mobile,
        pincode: session.metadata.pincode,
        city: session.metadata.city,
        state: session.metadata.state,
        block: session.metadata.block,
        locality: session.metadata.locality,
        landmark: session.metadata.landmark || "",
      };

      // ✅ Save everything to Order
      await Order.create({
        cartId,
        email,
        items: orderItems,
        subtotal,
        discount,
        delivery,
        total,
        address, // ✅ Full address saved here
        stripeSessionId: session.id,
      });

      // ✅ Clean up cart
      await Cart.deleteOne({ cartId });

      console.log("✅ Order successfully created for:", email);
      return res.status(200).send("Order created");
    } catch (err) {
      console.error("❌ Failed to create order:", err.message);
      return res.status(500).send("Internal Server Error");
    }
  }

  return res.status(200).send("Event received");
};















// export const handleStripeWebhook = async (req, res) => {
//   // Stripe header containing the signature
//   const sig = req.headers["stripe-signature"];

//   let event;

//   try {
//     // ✅ Webhook verification using secret from .env
//     event = stripe.webhooks.constructEvent(
//       req.body,                                // Raw body (must be untouched)
//       sig,                                     // Stripe's signature
//       process.env.STRIPE_WEBHOOK_SECRET        // ✅ Webhook secret from your .env file
//     );
//   } catch (err) {
//     console.error("❌ Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // ✅ Process only if checkout session is completed
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const cartId = session.client_reference_id;
//     const email = session.customer_details?.email || "unknown";

//     try {
//       const cart = await Cart.findOne({ cartId });

//       if (!cart || cart.items.length === 0) {
//         console.warn("🛒 Cart not found or empty:", cartId);
//         return res.status(400).send("Cart not found or empty");
//       }

//       const productIds = cart.items.map((item) => item.productId);
//       const products = await Product.find({ _id: { $in: productIds } });

//       let subtotal = 0;
//       const orderItems = [];

//       for (const item of cart.items) {
//         const product = products.find(
//           (p) => p._id.toString() === item.productId.toString()
//         );
//         if (!product) continue;

//         const basePrice = product.price?.original || 0;
//         const totalPrice = basePrice * item.quantity;
//         subtotal += totalPrice;

//         orderItems.push({
//           productId: product._id,
//           name: product.name,
//           size: item.size,
//           quantity: item.quantity,
//           price: basePrice,
//         });
//       }

//       const discount = Math.round(subtotal * 0.1);
//       const delivery = subtotal >= 2500 ? 0 : 100;
//       const total = subtotal - discount + delivery;

//       await Order.create({
//         cartId,
//         email,
//         items: orderItems,
//         subtotal,
//         discount,
//         delivery,
//         total,
//         stripeSessionId: session.id,
//       });

//       await Cart.deleteOne({ cartId });

//       console.log("✅ Order successfully created for:", email);
//       return res.status(200).send("Order created");
//     } catch (err) {
//       console.error("❌ Failed to create order:", err.message);
//       return res.status(500).send("Internal Server Error");
//     }
//   }

//   // For other events, just acknowledge
//   return res.status(200).send("Event received");
// };
