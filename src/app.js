import express from "express";
import productRoutes from "./routes/rou-product.js";
import userRoutes from "./routes/rou-user.js";
import cartRoutes from "./routes/rou-cart.js";
import wishlistRoutes from "./routes/rou-wishlist.js";
import newsletterRoutes from "./routes/rou-newsletter.js";
import searchRoutes from "./routes/rou-search.js";
import adminRoutes from "./routes/rou-admin.js";
import profileRoutes from "./routes/rou-profile.js"
import adressRoutes from "./routes/rou-adress.js"
import webhookRoutes from "./routes/rou-webhook.js"

import cors from "cors";
const app = express();


app.use(
  cors({
    origin: ["http://localhost:5173","https://vite-frontend-ten.vercel.app"],
  })
);
app.use( webhookRoutes);
app.use(express.json());

app.use(productRoutes);
app.use(userRoutes);
app.use(cartRoutes);
app.use(wishlistRoutes);
app.use(newsletterRoutes);
app.use(searchRoutes);
app.use(adminRoutes);
app.use(profileRoutes);
app.use(adressRoutes);

export default app;
