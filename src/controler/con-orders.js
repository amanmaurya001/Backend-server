import Order from "../models/mod-orders.js";

export const orderHistory = async (req, res) => {
  try {
    const cartId = req.user; // 👈 Yeh verify karo ki yeh cartId hai ya userId

    const orders = await Order.find({ cartId: cartId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this cart ID." });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching order history:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
