import express from "express";

import { getLogin,getRegister } from "../controler/con-user.js";

const router = express.Router();

router.post("/register", getRegister);

router.post("/login", getLogin);

export default router;