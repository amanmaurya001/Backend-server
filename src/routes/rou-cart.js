import express from "express";
import { createCart,showCart,deleteCartItem,createCheckoutSession} from "../controler/con-cart.js";
import { isLoggedIn } from "../middleware/mid-user.js";
import { addcartValidator,deleteCartItemValidator } from "../validator/val-cart.js";



const router = express.Router();


router.post("/addtocart",isLoggedIn,addcartValidator,createCart);
router.post("/checkoutsession",isLoggedIn,createCheckoutSession);
router.get("/cart",isLoggedIn,showCart);
router.delete("/deletecartitem/:itemId",deleteCartItemValidator ,isLoggedIn,deleteCartItem);


export default router;