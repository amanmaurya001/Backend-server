import express from "express";
import { profileDetails } from "../controler/con-profile.js";
import { isLoggedIn } from "../middleware/mid-user.js";
const router = express.Router();
router.get("/profile",isLoggedIn,profileDetails);
export default router;