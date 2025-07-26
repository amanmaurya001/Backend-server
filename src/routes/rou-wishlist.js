import express from "express";
import { createWishList,showWishList,deletewishItem } from "../controler/con-wishlist.js";
import { isLoggedIn } from "../middleware/mid-user.js";



const router = express.Router();


router.post("/addtoWishList",isLoggedIn,createWishList);
router.get("/showwishlist",isLoggedIn,showWishList);
router.delete("/deletewishitem/:itemId",isLoggedIn,deletewishItem);


export default router;