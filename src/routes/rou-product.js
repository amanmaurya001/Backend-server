import express from "express";
import { isLoggedIn } from "../middleware/mid-user.js";
import { genderParamValidator,randomGenderValidator,genderCategoryValidator,singleProductValidator } from "../validator/val-product.js";
import { getProductsByGender,getProductsByGenderCategory,getSingleProduct ,getRandomProductsByGender} from "../controler/con-product.js";
const router = express.Router();

router.get("/productlisting/:navGender/allproducts",genderParamValidator, getProductsByGender);
router.get("/randomSwiper/:Gender/products",randomGenderValidator, getRandomProductsByGender);

router.get(
  "/productlisting/:navGender/:navCategory",
  genderCategoryValidator,
  getProductsByGenderCategory
);

router.get("/products/:id",singleProductValidator,getSingleProduct);

export default router;