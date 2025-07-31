import express from "express"
import { orderHistory } from "../controler/con-orders.js";
import { isLoggedIn } from "../middleware/mid-user.js";
const router = express.Router();

router.get("/orderHistory",isLoggedIn, orderHistory);
export default router;