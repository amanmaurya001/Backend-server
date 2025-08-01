import express from "express"
import { search } from "../controler/con-search.js";
import { searchValidator } from "../validator/val-search.js";
const router = express.Router();
router.get("/search", searchValidator,search);

export default router;