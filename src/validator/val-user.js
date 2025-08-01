export const registerValidator = (req, res, next) => {
  let { username, email, password, gender, dob, phone } = req.body;
  const errors = [];

  // --- Username ---
  if (!username) {
    errors.push("username is required");
  } else {
    username = username.toString().trim().replace(/<[^>]*>?/gm, "");
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      errors.push("username must be 3-20 characters, letters/numbers/underscores only");
    }
    req.body.username = username;
  }

  // --- Email ---
  if (!email) {
    errors.push("email is required");
  } else {
    email = email.toString().trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("invalid email format");
    }
    req.body.email = email;
  }

  // --- Password ---
  if (!password) {
    errors.push("password is required");
  } else {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      errors.push(
        "password must be at least 6 characters, include uppercase, lowercase, number, and special character"
      );
    }
  }

  // --- Gender (required, must match schema enum) ---
  const allowedGenders = ["male", "female", "others"];
  if (!gender) {
    errors.push("gender is required");
  } else {
    gender = gender.toString().trim().toLowerCase();
    if (!allowedGenders.includes(gender)) {
      errors.push("gender must be male, female, or others");
    } else {
      req.body.gender = gender;
    }
  }

  // --- DOB (required, must be at least 14 years old) ---
  if (!dob) {
    errors.push("dob is required");
  } else {
    const dobDate = new Date(dob);
    const today = new Date();

    if (isNaN(dobDate.getTime())) {
      errors.push("dob must be a valid date");
    } else {
      const ageDiff = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      const d = today.getDate() - dobDate.getDate();

      const is14Plus =
        ageDiff > 14 ||
        (ageDiff === 14 && (m > 0 || (m === 0 && d >= 0)));

      if (!is14Plus) {
        errors.push("You must be at least 14 years old to register");
      } else {
        req.body.dob = dobDate.toISOString(); // clean ISO
      }
    }
  }

  // --- Phone (required) ---
  if (!phone) {
    errors.push("phone is required");
  } else {
    phone = phone.toString().trim();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      errors.push("phone must be a valid 10-digit Indian number starting with 6-9");
    } else {
      req.body.phone = phone;
    }
  }

  // --- Final error return ---
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors, // send array of errors
    });
  }

  next();
};


export const loginValidator = (req, res, next) => {
  let { username, password } = req.body;
  const errors = [];

  // --- Username ---
  if (!username) {
    errors.push("username is required");
  } else {
    username = username.toString().trim().replace(/<[^>]*>?/gm, "");
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      errors.push("username must be 3-20 characters, letters/numbers/underscores only");
    } else {
      req.body.username = username;
    }
  }

  // --- Password ---
  if (!password) {
    errors.push("password is required");
  } else {
    password = password.toString().trim();
    if (password.length < 6 || password.length > 64) {
      errors.push("password must be between 6 and 64 characters");
    } else {
      req.body.password = password;
    }
  }

  // --- Final Check ---
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};
