import express from "express";

import { getLogin,getRegister,changePassword,checkAuth,logout } from "../controler/con-user.js";
import { registerValidator,loginValidator } from "../validator/val-user.js";
import { loginRateLimit,registerRateLimit } from "../RateLimiter/Rate-user.js";
import { isLoggedIn } from "../middleware/mid-user.js";

const router = express.Router();

router.post("/register", registerRateLimit,registerValidator, getRegister);
router.get("/checkauth",checkAuth );
router.post("/logout",logout );
router.post("/login",loginRateLimit,loginValidator, getLogin);
router.post("/changePassword", isLoggedIn,changePassword)

export default router;