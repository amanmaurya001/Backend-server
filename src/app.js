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
import orderRoutes from "./routes/rou-order.js"
import cookieParser from 'cookie-parser';

import cors from "cors";
const app = express();

app.use(cookieParser()); 
const COROS_1=process.env.COROS_1;
const COROS_2=process.env.COROS_2;
const COROS_3=process.env.COROS_3;
app.use(
  cors({
    origin: [COROS_1, COROS_2, COROS_3],
    credentials: true 
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
app.use(orderRoutes);

export default app;
