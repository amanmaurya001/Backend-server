import express from "express";
import { isLoggedIn } from "../middleware/mid-user.js";
import { genderParamValidator,randomGenderValidator,genderCategoryValidator,singleProductValidator } from "../validator/val-product.js";
import { getProductsByGender,getProductsByGenderCategory,getSingleProduct ,getRandomProductsByGender} from "../controler/con-product.js";
import { productListingRateLimit,randomProductsRateLimit,categoryProductsRateLimit,singleProductRateLimit,antiScrapingRateLimit } from "../RateLimiter/rate-products.js";
const router = express.Router();

router.get("/productlisting/:navGender/allproducts",   productListingRateLimit, antiScrapingRateLimit,genderParamValidator, getProductsByGender);

router.get("/productlisting/:navGender/:navCategory", categoryProductsRateLimit,antiScrapingRateLimit,genderCategoryValidator,getProductsByGenderCategory);

router.get("/products/:id",                           singleProductRateLimit,    antiScrapingRateLimit,singleProductValidator,getSingleProduct);

























router.get("/randomSwiper/:Gender/products",          randomProductsRateLimit,  antiScrapingRateLimit,randomGenderValidator, getRandomProductsByGender);

export default router;