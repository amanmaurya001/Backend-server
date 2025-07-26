import Product from "../models/product.js";







export const getProductsByGender = async (req, res) => {
  try {
    const { navGender } = req.params;
    const query1 = {};

    if (navGender) {
      query1.gender = new RegExp(`^${navGender}$`, "i");
    }

    const allproducts = await Product.find(query1);
    res.status(200).json(allproducts);
  } catch (error) {
    res.status(500).json({ message: "Failed to filter products", error });
  }
};





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
    res.status(500).json({ message: "Failed to filter products", error });
  }
};






export const getSingleProduct = async (req, res) => {
  const { id } = req.params;
const show = await Product.findOne({ id:id });

  if (!show) {
    throw new Error(`product with id ${id} does not exist`);
  }

  res.status(200).json(show);
};
