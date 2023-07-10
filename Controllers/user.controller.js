import userSchema from "../models/users-model.js";

export const profile = async (req, res) => {
  const { id } = req.userData;
  try {
    const user = await userSchema
      .findById({ _id: id })
      .populate("following followers", "firstName lastName avatar")
      .select("-password -__v -createdAt -updatedAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, Please try again later",
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { id } = req.userData;
    const { firstName, lastName, avatar, bio, cover, password, email } =
      req.body;

    const userData = await userSchema.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          firstName,
          lastName,
          bio,
          avatar,
          cover,
          password,
          email,
        },
      }
    );

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = {
      _id: id,
      firstName: firstName,
      lastName: lastName,
      bio: bio,
      avatar: avatar,
      cover: cover,
      password: password,
      email: email,
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Profile not Updated ! please try again after someTime",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res.status(400).json({ message: "User id is required" });

    const findUser = await userSchema
      .findById({ _id: userId })
      .populate("following followers", "firstName lastName avatar");

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: findUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Profile not Updated ! please try again after someTime",
      success: false,
      data: null,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await userSchema
      .find()
      .populate("following followers", "firstName lastName avatar");

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false, data: null });
  }
};

//follow user

export const followUser = async (req, res) => {
  try {
    const { id } = req.userData;
    const { userId } = req.params;

    const user = await userSchema.findById({ _id: id });
    const userToFollow = await userSchema.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.following.includes(userId)) {
      return res.status(400).json({ message: "Already following" });
    }

    await userSchema.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          following: userId,
        },
      }
    );

    await userSchema.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          followers: id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "User followed successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message:
        "The User You Want to follow is not exits ! please try again after someTime",
      success: false,
      data: null,
    });
  }
};

export const unFolloweUser = async (req, res) => {
  try {
    const { id } = req.userData;

    const { userId } = req.params;

    const user = await userSchema.findById({ _id: id });
    const userToFollow = await userSchema.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.following.includes(userId)) {
      return res.status(400).json({ message: "Already unFollwing" });
    }

    await userSchema.findByIdAndUpdate(
      { _id: id },
      {
        $pull: {
          following: userId,
        },
      }
    );

    await userSchema.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: {
          followers: id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message:
        "The User You Want to unfollow is not exits ! please try again after someTime",
      success: false,
      data: null,
    });
  }
};

export const friends = async (req, res) => {
  try {
    const { id } = req.userData;

    const user = await userSchema
      .findById({ _id: id })
      .populate("following followers", "firstName lastName avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = user.following;

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: friends,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong ! please try again after someTime",
      success: false,
      data: null,
    });
  }
};

export const userToFollow = async (req, res) => {
  try {
    const { id } = req.userData;

    const user = await userSchema.findById({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const freinds = user.following;

    const users = await userSchema
      .find({ _id: { $nin: freinds } })
      .populate("following followers", "firstName lastName avatar");

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong ! please try again after someTime",
      success: false,
      data: null,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.userData;

    const user = await userSchema.findById({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await userSchema.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong ! please try again after someTime",
      success: false,
      data: null,
    });
  }
};
