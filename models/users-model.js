import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: [true, "Please enter your first name"],
      min: 3,
      max: 10,
    },
    lastName: {
      type: String,
      require: [true, "Please enter your last name"],
      min: 3,
      max: 10,
    },
    email: {
      type: String,
      require: [true, "Please enter your email"],
      lowercase: [true, "Please enter your email in lowercase"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      require: [true, "Please enter your password"],
      min: 6,
      max: 20,
    },
    bio: {
      type: String,
      default: "Hey there, I am ....",
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dtswa0rzu/image/upload/v1649933676/monkey-avatar_nbyc1i.png",
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    cover: {
      type: String,
      default:
        "https://res.cloudinary.com/dtswa0rzu/image/upload/v1650196033/talkline_default_cover.png",
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
