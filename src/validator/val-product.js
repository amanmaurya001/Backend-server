export const genderParamValidator = (req, res, next) => {
  const { navGender } = req.params;
  const allowedGenders = ["men", "women", "kids", "unisex"];
  const cleanGender = navGender?.toString().trim().toLowerCase().replace(/<[^>]*>?/gm, "");

  if (!cleanGender || !allowedGenders.includes(cleanGender)) {
    return res.status(400).json({ message: "Invalid or missing gender parameter" });
  }

  req.params.navGender = cleanGender;
  next();
};


export const randomGenderValidator = (req, res, next) => {
  const { Gender } = req.params;
  const allowedGenders = ["men", "women", "kids", "unisex"];
  const clean = Gender?.toString().trim().toLowerCase().replace(/<[^>]*>?/gm, "");

  if (!clean || !allowedGenders.includes(clean)) {
    return res.status(400).json({ message: "Invalid gender parameter" });
  }

  req.params.Gender = clean;
  next();
};



export const genderCategoryValidator = (req, res, next) => {
  const { navGender, navCategory } = req.params;
  const allowedGenders = ["men", "women"];
  const allowedCategories = ["shirt","t-shirt","kurti","crop","corset","pants","denim-jeans","trousers","mini","midi","maxi","floral","cottage","polo","formal-pants"];

  const gender = navGender?.toString().trim().toLowerCase().replace(/<[^>]*>?/gm, "");
  const category = navCategory?.toString().trim().toLowerCase().replace(/<[^>]*>?/gm, "");

  if (!gender || !allowedGenders.includes(gender)) {
    return res.status(400).json({ message: "Invalid gender" });
  }

  if (!category || !allowedCategories.includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  req.params.navGender = gender;
  req.params.navCategory = category;
  next();
};




export const singleProductValidator = (req, res, next) => {
  try {
    let { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Sanitize input
    id = id.toString().trim().replace(/<[^>]*>?/gm, "");

    // Validate against custom pattern: alphanumerics with hyphen/underscore
    const isValidCustomId = /^[a-zA-Z0-9_-]+$/.test(id);

    if (!isValidCustomId) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    req.params.id = id;
    next();
  } catch (err) {
    console.error("Validator Error:", err);
    return res.status(500).json({ message: "Something went wrong in validator" });
  }
};
