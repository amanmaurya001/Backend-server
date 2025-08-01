import express from "express";

import { getLogin,getRegister } from "../controler/con-user.js";
import { registerValidator,loginValidator } from "../validator/val-user.js";

const router = express.Router();

router.post("/register",registerValidator, getRegister);

router.post("/login",loginValidator, getLogin);

export default router;