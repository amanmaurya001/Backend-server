import Product from "../models/product.js";

export const search = async (req, res) => {
  try {
    // Get search text from query parameters
    const searchText = req.query.search;

    // Validate search text
    if (!searchText || typeof searchText !== "string" || !searchText.trim()) {
      return res.status(400).json({
        error: "Invalid search query",
        details: "Please provide a non-empty search parameter."
      });
    }

    // Convert search text to lowercase and split into words
    const searchArray = searchText.trim().toLowerCase().split(" ");

    // Fields where we perform regex search on string values
    const stringFields = ["name", "gender", "category", "overview"];

    // Fields where the value is an array, so we check with `$in`
    const arrayFields = ["occasion", "description", "tags"];

    // This will hold all our search conditions
    const searchConditions = [];

    // For each search word, create queries for both string & array fields
    searchArray.forEach((word) => {
      // String field search with case-insensitive regex
      stringFields.forEach((field) => {
        searchConditions.push({
          [field]: { $regex: word, $options: "i" }
        });
      });

      // Array field search using `$in` with regex
      arrayFields.forEach((field) => {
        searchConditions.push({
          [field]: { $in: [new RegExp(word, "i")] }
        });
      });
    });

    // Execute MongoDB search query
    const products = await Product.find({ $or: searchConditions });

    // Respond with matching products
    return res.status(200).json(products);

  } catch (err) {
    console.error("Search Error:", err); // Log error in server console for debugging
    return res.status(500).json({
      error: "Search failed",
      details: err.message || "An unexpected error occurred while searching."
    });
  }
};

