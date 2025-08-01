import express from "express";
import { createWishList,showWishList,deletewishItem } from "../controler/con-wishlist.js";
import { isLoggedIn } from "../middleware/mid-user.js";
import { wishlistValidator ,deleteWishlistItemValidator} from "../validator/val-wishlist.js";


const router = express.Router();


router.post("/addtoWishList",isLoggedIn,wishlistValidator,createWishList);
router.get("/showwishlist",isLoggedIn,showWishList);
router.delete("/deletewishitem/:itemId",isLoggedIn,deleteWishlistItemValidator,deletewishItem);


export default router;