import userSchema from "../models/users-model.js";
import generateToken from "../services/token.js";
import CloudinaryServices from "../services/Cloudinary.services.js";

export const signup = async (req, res) => {
  try {
    //taking response from body
    const { firstName, lastName, email, password, image } = req.body;

    //check if user Exits

    const userExits = await userSchema.findOne({ email });

    //if user exits

    if (userExits) {
      return res.status(400).json({ message: "User already exists" });
    }

    //upload image to cloudinary with base64 fomat adding data:image/png;base64, in front of image

    var imageUrl;

    if (image) {
      const buffer = Buffer.from(
        image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      //generating random imagepath name
      const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

      //calling cloudinary services and passing base64 url and imagepath

      imageUrl = await CloudinaryServices.uploadImage(buffer, imagePath);
    }
    //save user to db
    const user = new userSchema({
      firstName,
      lastName,
      email,
      password,
      avatar: imageUrl,
    });

    const result = await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token: generateToken({ ...result }),
        user: result,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    //taking response from body
    const { email, password } = req.body;

    //check if user Exits

    const userExits = await userSchema.findOne({ email });

    //if user does not exits

    if (!userExits) {
      return res
        .status(400)
        .json({ message: "User does not exists! Please signup first" });
    }

    //check if password is not correct
    if (userExits.password !== password) {
      return res.status(400).json({
        message: "Invalid credentials! Please check your password carefully",
      });
    }

    //login user
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token: generateToken({ id: userExits._id }),
        user: userExits,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
