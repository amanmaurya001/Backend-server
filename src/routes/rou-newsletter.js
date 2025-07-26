import express from "express"
import { createNewsletter } from "../controler/con-newsletter.js";
import { newsletterLimiter } from "../middleware/mid-ratelimit.js";
const router = express.Router();


router.post("/newsletter",newsletterLimiter,createNewsletter);
export default router;