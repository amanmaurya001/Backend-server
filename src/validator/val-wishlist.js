export const wishlistValidator = (req, res, next) => {
  let { productId } = req.body;
  const errors = [];

  // --- productId validation ---
  if (!productId) {
    errors.push("productId is required");
  } else {
    productId = productId.toString().trim().replace(/<[^>]*>?/gm, "");
    const isValidMongoId = /^[a-f\d]{24}$/i.test(productId);
    if (!isValidMongoId) {
      errors.push("Invalid productId format");
    } else {
      req.body.productId = productId;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};
export const deleteWishlistItemValidator = (req, res, next) => {
  let { itemId } = req.params;
  const errors = [];

  if (!itemId) {
    errors.push("itemId is required in URL");
  } else {
    itemId = itemId.toString().trim().replace(/<[^>]*>?/gm, "");
    const isValidMongoId = /^[a-f\d]{24}$/i.test(itemId);
    if (!isValidMongoId) {
      errors.push("Invalid itemId format");
    } else {
      req.params.itemId = itemId; // assign clean id
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};
