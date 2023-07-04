import mongoose from "mongoose";
import bookmarkModel from "./bookmark-model.js";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    content: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likedByUsers: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 50,
    },
    comments: {
      type: Array,
      default: [],
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);
