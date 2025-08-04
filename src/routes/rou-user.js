import express from "express";

import { getLogin,getRegister } from "../controler/con-user.js";
import { registerValidator,loginValidator } from "../validator/val-user.js";
import { loginRateLimit,registerRateLimit } from "../RateLimiter/Rate-user.js";

const router = express.Router();

router.post("/register", registerRateLimit,registerValidator, getRegister);

router.post("/login",loginRateLimit,loginValidator, getLogin);

export default router;