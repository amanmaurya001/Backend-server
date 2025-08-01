import express from "express"
import { createNewsletter } from "../controler/con-newsletter.js";
import { newsletterLimiter } from "../middleware/mid-ratelimit.js";
import { secureEmailValidator } from "../validator/val-email.js";
const router = express.Router();


router.post("/newsletter",newsletterLimiter,secureEmailValidator,createNewsletter);
export default router;