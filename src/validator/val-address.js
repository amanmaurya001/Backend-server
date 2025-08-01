export const addressValidator = (req, res, next) => {
  let {
    fullName,
    mobile,
    pincode,
    city,
    state,
    block,
    locality,
    landmark,
    addressType,
    isDefault,
  } = req.body;

  const errors = [];

  // --- Text field sanitization helper ---
  const sanitize = (val) => val.toString().trim().replace(/<[^>]*>?/gm, "");

  // --- Capitalize helper ---
  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // --- Full Name ---
  if (!fullName) {
    errors.push("fullName is required");
  } else {
    fullName = sanitize(fullName);
    if (fullName.length < 3) errors.push("fullName must be at least 3 characters");
    req.body.fullName = fullName;
  }

  // --- Mobile ---
  if (!mobile) {
    errors.push("mobile is required");
  } else {
    mobile = mobile.toString().trim();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      errors.push("mobile must be a valid 10-digit Indian number starting with 6-9");
    }
    req.body.mobile = mobile;
  }

  // --- Pincode ---
  if (!pincode) {
    errors.push("pincode is required");
  } else {
    pincode = pincode.toString().trim();
    if (!/^\d{6}$/.test(pincode)) {
      errors.push("pincode must be a 6-digit number");
    }
    req.body.pincode = pincode;
  }

  // --- City ---
  if (!city) {
    errors.push("city is required");
  } else {
    city = sanitize(city);
    req.body.city = city;
  }

  // --- State ---
  if (!state) {
    errors.push("state is required");
  } else {
    state = sanitize(state);
    req.body.state = state;
  }

  // --- Block ---
  if (!block) {
    errors.push("block is required");
  } else {
    block = sanitize(block);
    req.body.block = block;
  }

  // --- Locality ---
  if (!locality) {
    errors.push("locality is required");
  } else {
    locality = sanitize(locality);
    req.body.locality = locality;
  }

  // --- Landmark (optional) ---
  if (landmark) {
    landmark = sanitize(landmark);
    req.body.landmark = landmark;
  }

  // --- addressType (optional, capitalize to match schema) ---
  const allowedTypes = ["Home", "Work", "Other"];
  if (addressType) {
    addressType = capitalize(addressType);
    if (!allowedTypes.includes(addressType)) {
      errors.push("addressType must be Home, Work, or Other");
    } else {
      req.body.addressType = addressType;
    }
  } else {
    req.body.addressType = "Home"; // default
  }

  // --- isDefault (optional) ---
  if (typeof isDefault !== "undefined") {
    if (typeof isDefault === "string") {
      isDefault = isDefault.toLowerCase() === "true";
    } else if (typeof isDefault !== "boolean") {
      errors.push("isDefault must be true or false");
    }
    req.body.isDefault = isDefault;
  } else {
    req.body.isDefault = false;
  }

  // --- Final check ---
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};
