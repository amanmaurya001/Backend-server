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

  const fieldErrors = {};

  // --- Text field sanitization helper ---
  const sanitize = (val) => val.toString().trim().replace(/<[^>]*>?/gm, "");

  // --- Capitalize helper ---
  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // --- Full Name ---
  if (!fullName) {
    fieldErrors.fullName = "fullName is required";
  } else {
    fullName = sanitize(fullName);
    if (fullName.length < 3) fieldErrors.fullName = "fullName must be at least 3 characters";
    req.body.fullName = fullName;
  }

  // --- Mobile ---
  if (!mobile) {
    fieldErrors.mobile = "mobile is required";
  } else {
    mobile = mobile.toString().trim();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      fieldErrors.mobile = "mobile must be a valid 10-digit Indian number starting with 6-9";
    }
    req.body.mobile = mobile;
  }

  // --- Pincode ---
  if (!pincode) {
    fieldErrors.pincode = "pincode is required";
  } else {
    pincode = pincode.toString().trim();
    if (!/^\d{6}$/.test(pincode)) {
      fieldErrors.pincode = "pincode must be a 6-digit number";
    }
    req.body.pincode = pincode;
  }

  // --- City ---
  if (!city) {
    fieldErrors.city = "city is required";
  } else {
    city = sanitize(city);
    req.body.city = city;
  }

  // --- State ---
  if (!state) {
    fieldErrors.state = "state is required";
  } else {
    state = sanitize(state);
    req.body.state = state;
  }

  // --- Block ---
  if (!block) {
    fieldErrors.block = "block is required";
  } else {
    block = sanitize(block);
    req.body.block = block;
  }

  // --- Locality ---
  if (!locality) {
    fieldErrors.locality = "locality is required";
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
      fieldErrors.addressType = "addressType must be Home, Work, or Other";
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
      fieldErrors.isDefault = "isDefault must be true or false";
    }
    req.body.isDefault = isDefault;
  } else {
    req.body.isDefault = false;
  }

  // --- Final check ---
  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json({ 
      success: false, 
      message: "Validation failed",
      fieldErrors: fieldErrors // This matches what your frontend expects
    });
  }

  next();
};


export const editAddressValidator = (req, res, next) => {
  let { addressId } = req.params;
  const errors = [];

  // Step 1: Required check
  if (!addressId) {
    errors.push("addressId is required in URL");
  } else {
    // Step 2: Sanitize input
    addressId = addressId.toString().trim().replace(/<[^>]*>?/gm, "");

    // Step 3: Validate ObjectId format
    const isValidMongoId = /^[a-f\d]{24}$/i.test(addressId);
    if (!isValidMongoId) {
      errors.push("Invalid addressId format");
    } else {
      req.params.addressId = addressId; // update cleaned id
    }
  }

  // Step 4: If error, respond
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};
