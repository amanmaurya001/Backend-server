import Product from "../models/product.js";

// export const search = async (req, res) => {
//   try {
//     const searchText = req.body.search;
//     const searchArray = searchText.trim().split(" ");
//     res.json({ searchArray });
//   } catch (err) {
//     res.json({ error: "no such product " });
//   }
// };









export const search = async (req, res) => {
  try {
    const searchText = req.query.search;
    const searchArray = searchText.trim().toLowerCase().split(" ");

    // Fields to search — split by type
    const stringFields = ["name", "gender", "category", "overview"];
    const arrayFields = ["occasion", "description", "tags"];

    const searchResult = [];

    searchArray.forEach(word => {
      // Add string field regex queries
      stringFields.forEach(field => {
       searchResult.push({
          [field]: { $regex: word, $options: "i" }
        });
      });

      // Add array field $in match queries
      arrayFields.forEach(field => {
     searchResult.push({
          [field]: { $in: [new RegExp(word, "i")] }
        });
      });
    });

    const products = await Product.find({ $or: searchResult });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
};

