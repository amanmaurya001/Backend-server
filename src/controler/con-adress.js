import User from "../models/user.js";

export const createAddress = async (req, res) => {
  try {
    const {
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

    const idOfUser = req.user;
    console.log(idOfUser);

    // Find user by ID
    const user = await User.findById({ _id: idOfUser });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate required fields
    if (
      !fullName ||
      !mobile ||
      !pincode ||
      !city ||
      !state ||
      !block ||
      !locality
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Create new address object
    const newAddress = {
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      pincode: pincode.trim(),
      city: city.trim(),
      state: state.trim(),
      block: block.trim(),
      locality: locality.trim(),
      landmark: landmark ? landmark.trim() : "",
      addressType: addressType || "Home",
      isDefault: isDefault || false,
    };

    // Add new address to user's addresses array
    user.addresses.push(newAddress);

    // Save user with new address
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: {
        userId: user._id,
        totalAddresses: user.addresses.length,
        newAddress: user.addresses[user.addresses.length - 1],
      },
    });
  } catch (err) {
    console.error("Error creating address:", err);

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const showAddress = async (req, res) => {
  try {
    const idOfUser = req.user;
    const user = await User.findById({ _id: idOfUser });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userAddressObj = user.addresses;

    return res.status(200).json({
      success: true,
      addresses: userAddressObj,
    });
  } catch (err) {
    console.error("Error in showAddress:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const editAddressDataShow = async (req, res) => {
  try {
    const { addressId } = req.params;
    const idOfUser = req.user;
    const user = await User.findById({ _id: idOfUser });

    const adressObjItem = user.addresses.find(
      (item) => item._id.toString() === addressId
    );
    return res.status(200).json({
      success: true,
      targetAddresses: adressObjItem,
    });
  } catch (err) {
    console.error("Error in showAddress:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updateAddress = async (req, res) => {
  try {
    const {
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
    const { addressId } = req.params;
    const idOfUser = req.user;
    const user = await User.findById({ _id: idOfUser });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const adressObjItem = user.addresses.find(
      (item) => item._id.toString() === addressId
    );
    if (!adressObjItem) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Update fields
    adressObjItem.fullName = fullName;
    adressObjItem.mobile = mobile;
    adressObjItem.pincode = pincode;
    adressObjItem.city = city;
    adressObjItem.state = state;
    adressObjItem.block = block;
    adressObjItem.locality = locality;
    adressObjItem.landmark = landmark;
    adressObjItem.addressType = addressType;
    adressObjItem.isDefault = isDefault;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      updatedAddress:adressObjItem,
    });
  } catch (err) {
     console.error("Error updating address:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
