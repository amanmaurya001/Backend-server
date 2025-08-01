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
  const allowedCategories = ["tshirt", "shirt", "pant", "kurta", "dress", "top", "jeans", "saree"];

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
  let { id } = req.params;

  id = id?.toString().trim().replace(/<[^>]*>?/gm, "");
  const isValidMongoId = /^[a-f\d]{24}$/i.test(id);

  if (!isValidMongoId) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  req.params.id = id;
  next();
};
