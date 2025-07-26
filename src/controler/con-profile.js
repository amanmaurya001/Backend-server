import User from "../models/user.js";

export const profileDetails = async (req, res) => {
  try {
    const profileId = req.user;
    const user = await User.findById({ _id: profileId });
    if (!user) {
      throw new Error("username already exist ");
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      dob: user.dob,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
