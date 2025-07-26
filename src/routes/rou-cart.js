import express from "express";
import { createCart,showCart,deleteCartItem,createCheckoutSession} from "../controler/con-cart.js";
import { isLoggedIn } from "../middleware/mid-user.js";



const router = express.Router();


router.post("/addtocart",isLoggedIn,createCart);
router.post("/checkoutsession",isLoggedIn,createCheckoutSession);
router.get("/cart",isLoggedIn,showCart);
router.delete("/deletecartitem/:itemId",isLoggedIn,deleteCartItem);


export default router;