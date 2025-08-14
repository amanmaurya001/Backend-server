import Product from "../models/product.js";

// ✅ Get products by gender
export const getProductsByGender = async (req, res) => {
  try {
    const { navGender } = req.params;
    const query = {};

    if (navGender) {
      query.gender = new RegExp(`^${navGender}$`, "i"); // Case-insensitive match
    }

    const allProducts = await Product.find(query);
    res.status(200).json(allProducts);
  } catch (error) {
    console.error("Error in getProductsByGender:", error);
    res.status(500).json({ message: "Failed to filter products" });
  }
};



// ✅ Get products by gender & category
export const getProductsByGenderCategory = async (req, res) => {
  try {
    const { navGender, navCategory } = req.params;
    const query = {};

    if (navGender) {
      query.gender = new RegExp(`^${navGender}$`, "i");
    }
    if (navCategory) {
      query.category = new RegExp(`^${navCategory}$`, "i");
    }

    const filteredProducts = await Product.find(query);
    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error("Error in getProductsByGenderCategory:", error);
    res.status(500).json({ message: "Failed to filter products" });
  }
};

// ✅ Get single product by ID
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ id: id });

    if (!product) {
      return res.status(404).json({ message: `Product with id ${id} does not exist` });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getSingleProduct:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};



// ✅ Get random products by gender
export const getRandomProductsByGender = async (req, res) => {
  try {
    const { Gender } = req.params;

    const randomProducts = await Product.aggregate([
      {
        $match: {
          gender: { $regex: `^${Gender}$`, $options: "i" },
        },
      },
      {
        $sample: { size: 8 },
      },
    ]);

    res.status(200).json(randomProducts);
  } catch (error) {
    console.error("Error in getRandomProductsByGender:", error);
    res.status(500).json({ message: "Something went wrong while fetching products" });
  }
};