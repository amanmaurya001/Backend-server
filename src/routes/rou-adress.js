import express from "express";
import { createAddress,showAddress ,editAddressDataShow,updateAddress} from "../controler/con-adress.js";
import { isLoggedIn } from "../middleware/mid-user.js";
const router = express.Router();
router.post("/createAdress",isLoggedIn,createAddress );
router.get("/showAdress",isLoggedIn,showAddress );
router.get("/editShowAdress/:addressId",isLoggedIn,editAddressDataShow );
router.post("/updateAddress/:addressId",isLoggedIn,updateAddress );
export default router;