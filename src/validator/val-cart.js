export const addcartValidator = (req, res, next) => {
  let { productId, quantity, size } = req.body;
  const errors = [];

  // --- productId check ---
  if (!productId) {
    errors.push("productId is required");
  } else {
    productId = productId.trim();
    const isValidMongoId = /^[a-f\d]{24}$/i.test(productId);
    if (!isValidMongoId) {
      errors.push("Invalid productId format");
    }
    req.body.productId = productId;
  }

  // --- size check (strict allowed values) ---
  const allowedSizes = ["xs", "s", "m", "l", "xl", "xll"];
  if (!size) {
    errors.push("size is required");
  } else {
    size = size.toString().trim().toLowerCase().replace(/<[^>]*>?/gm, "");
    if (!allowedSizes.includes(size)) {
      errors.push("Invalid size. Must be one of: xs, s, m, l, xl, xll");
    } else {
      req.body.size = size;
    }
  }

  // --- quantity check (must be number between 1 and 10) ---
  if (quantity !== undefined) {
    quantity = Number(quantity); // 💥 FIX: convert to number
    if (isNaN(quantity)) {
      errors.push("quantity must be a number");
    } else if (quantity < 1 || quantity > 10) {
      errors.push("quantity must be between 1 and 10");
    } else {
      req.body.quantity = quantity;
    }
  } else {
    req.body.quantity = 1; // default quantity
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};
export const deleteCartItemValidator = (req, res, next) => {
  let { itemId } = req.params;
  const errors = [];

  // Step 1: Check presence
  if (!itemId) {
    errors.push("itemId is required in URL");
  } else {
    // Step 2: Clean and sanitize
    itemId = itemId.toString().trim().replace(/<[^>]*>?/gm, "");

    // Step 3: Check if valid MongoDB ObjectId
    const isValidMongoId = /^[a-f\d]{24}$/i.test(itemId);
    if (!isValidMongoId) {
      errors.push("Invalid itemId format");
    } else {
      req.params.itemId = itemId; // safe to assign
    }
  }

  // Step 4: Send response if invalid
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};
