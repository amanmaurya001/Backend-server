import express from "express";
import { isLoggedIn } from "../middleware/mid-user.js";
import { getProductsByGender,getProductsByGenderCategory,getSingleProduct ,getRandomProductsByGender} from "../controler/con-product.js";
const router = express.Router();

router.get("/productlisting/:navGender/allproducts", getProductsByGender);
router.get("/randomSwiper/:Gender/products", getRandomProductsByGender);

router.get(
  "/productlisting/:navGender/:navCategory",
  getProductsByGenderCategory
);

router.get("/products/:id",getSingleProduct);

export default router;