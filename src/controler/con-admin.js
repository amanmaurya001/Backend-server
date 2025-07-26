import Product from "../models/product.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SERCET_KEY;

export const dashboardIsAvailable = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decodedUserId = jwt.verify(token, JWT_SECRET);
    const searchingId = decodedUserId.userId;
    const checkRole = await User.findById(searchingId);
    if (checkRole.role === "admin") {
      res.status(200).json({ access: true });
    } else {
      res.status(403).json({ access: false });
    }
  } catch (err) {
    throw new Error("server error");
  }
};

export const createProductByAdmin = async (req, res) => {
  try {
    const {
      id,
      name,
      gender,
      category,
      price,
      rating,
      ratingCount,
      sizes,
      material,
      pattern,
      sleeves,
      color,
      occasion,
      overview,
      description,
      care,
      images,
      tags,
      productNote,
    } = req.body;

    const checkId = await Product.findOne({ id });
    if (checkId) {
      throw new Error("this product id already Exist ");
    } else {
      const newProduct = new Product({
        id,
        name,
        gender,
        category,
        price: price,
        rating,
        ratingCount,
        sizes,
        material,
        pattern,
        sleeves,
        color,
        occasion,
        overview,
        description,
        care,
        images,
        tags,
        productNote,
      });
      await newProduct.save();
      res
        .status(201)
        .json({ message: "Product created successfully", product: newProduct });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error while creating product" });
  }
};

export const UpdateProductByAdmin = async (req, res) => {
  try {
    const { SingleProductId } = req.params;
    const {
      id,
      name,
      gender,
      category,
      price,
      rating,
      ratingCount,
      sizes,
      material,
      pattern,
      sleeves,
      color,
      occasion,
      overview,
      description,
      care,
      images,
      tags,
      productNote,
    } = req.body;

    const checkId = await Product.findOne({ id });
    if (checkId && checkId._id.toString() !== SingleProductId) {
      return res.status(400).json({
        message: "Choose a different product ID — this ID already exists.",
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      SingleProductId, // match based on product id
      {
        id,
        name,
        gender,
        category,
        price,
        rating,
        ratingCount,
        sizes,
        material,
        pattern,
        sleeves,
        color,
        occasion,
        overview,
        description,
        care,
        images,
        tags,
        productNote,
      },
      { new: true }
    );
    res
      .status(200)
      .json({
        message: "Product upadated successfully",
        product: updatedProduct,
      });
  } catch (err) {
    res.status(500).json({ message: "Server error while updating  product" });
  }
};

export const adminProduts = async (req, res) => {
  try {
    const rawProducts = await Product.find(
      {},
      {
        _id: 1,
        id: 1,
        name: 1,
        category: 1,
        gender: 1,
        price: 1,
        sizes: 1,

        images: 1,
      }
    );

    const lodu = rawProducts.map((product) => ({
      objId: product._id,
      productId: product.id,
      name: product.name,
      gender: product.gender,
      category: product.category,
      price: product.price.original, // ✅ sirf offer price
      sizes: product.sizes,

      image: product.images?.[0] || "", // ✅ sirf pehla image
    }));
    res.status(200).json(lodu);
  } catch (err) {
    res.status(401).json({ message: "failed", err });
  }
};
export const adminSingleProduct = async (req, res) => {
  try {
    const { SingleProductId } = req.params;
    const productData = await Product.findById(SingleProductId);
    if (!productData) {
      res.status(500).json({ message: "this id doesnt exist", error });
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json({ message: "Failed to filter products", error });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { deleteId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(deleteId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
};
