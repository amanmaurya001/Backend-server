import express from "express";

import { getLogin,getRegister,changePassword } from "../controler/con-user.js";
import { registerValidator,loginValidator } from "../validator/val-user.js";
import { loginRateLimit,registerRateLimit } from "../RateLimiter/Rate-user.js";
import { isLoggedIn } from "../middleware/mid-user.js";

const router = express.Router();

router.post("/register", registerRateLimit,registerValidator, getRegister);

router.post("/login",loginRateLimit,loginValidator, getLogin);
router.post("/changePassword", isLoggedIn,changePassword)

export default router;