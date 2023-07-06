import postSchema from "../models/post-model.js";
import usersModel from "../models/users-model.js";
import { uuid } from "uuidv4";
import CloudinaryServices from "../services/Cloudinary.services.js";

const createPost = async (req, res) => {
  try {
    const { id } = req.userData;

    const { content, image } = req.body;

    if (!content && !image) {
      return res.status(400).json({
        message: "Please add content or image",
        success: false,
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        message: "Content should be less than 1000 characters",
        success: false,
      });
    }

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

    const newPost = new postSchema({
      userId: id,
      content: content,
      img: imageUrl,
    });

    const result = await newPost.save();

    return res.status(201).json({
      message: "post created Successfully",
      success: true,
      postData: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Post not created ! please try again after someTime",
    });
  }
};

const getAllPost = async (req, res) => {
  try {
    const findAllPost = await postSchema
      .find()
      .populate("userId likes")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "post fetched successfully",
      success: true,
      postData: findAllPost,
    });
  } catch (err) {
    return res.status(500).json({
      message: "No Post Available ! please try again after sometimes",
      success: false,
    });
  }
};

//get post by specific user

const getPostByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const findAllPost = await postSchema
      .find({ userId: userId })
      .populate("userId")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "post fetched successfully",
      success: true,
      postData: findAllPost,
    });
  } catch (err) {
    return res.status(500).json({
      message: "No Post Available ! please try again after sometimes",
      success: false,
    });
  }
};

const editPost = async (req, res) => {
  try {
    const { id } = req.userData;

    const { postId } = req.params;

    const { content, image } = req.body;

    if (!content && !image) {
      return res.status(400).json({
        message: "Please add content or image",
        success: false,
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        message: "Content should be less than 1000 characters",
        success: false,
      });
    }

    const itemToUpdate = await postSchema.findOneAndUpdate(
      { _id: postId, userId: id },

      {
        $set: {
          content: content,
          img: image,
        },
      },
      { new: true }
    );

    if (!itemToUpdate) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Post Edited Successfully",
      success: true,
      postData: itemToUpdate,
    });
  } catch (err) {
    return res.status(500).json({
      message:
        "Something went wrong, post is Not Edited ,Please try again later",
      success: false,
    });
  }
};

//like controller

const likePost = async (req, res) => {
  try {
    const { id } = req.userData;
    const { postId } = req.params;
    // const { type } = req.body;

    const itemToUpdate = await postSchema.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          likes: id,
        },
      },
      { new: true }
    );
    console.log(
      "🚀 ~ file: post.controller.js:178 ~ likePost ~ itemToUpdate:",
      itemToUpdate
    );

    if (!itemToUpdate) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Post Liked Successfully",
      success: true,
      postData: itemToUpdate,
    });
  } catch (err) {
    return res.status(500).json({
      message:
        "Something went wrong, post is Not Liked ,Please try again later",
      success: false,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    //id of logged user
    const { id } = req.userData;

    //id of post
    const { postId } = req.params;

    const itemToDelete = await postSchema.findOneAndDelete({
      _id: postId,
      userId: id,
    });
    // if post not found or post is not created by logged user
    if (!itemToDelete) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    //if post is created by logged user then delete post
    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message:
        "Something went wrong , Post is not Deleted! ,please try again after sometimes",
      success: false,
    });
  }
};

//comment controller
const createComment = async (req, res) => {
  try {
    const { id } = req.userData;
    const { postId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        message: "Please add comment",
        success: false,
      });
    }

    if (comment.length > 1000) {
      return res.status(400).json({
        message: "Comment should be less than 1000 characters",
        success: false,
      });
    }

    const commentedUser = await usersModel.findOne({ _id: id });

    const itemToUpdate = await postSchema.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          comments: {
            commentId: uuid(),
            comment,
            commentedBy: commentedUser,
            likes: 0,
            isLiked: false,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!itemToUpdate) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Comment Added Successfully",
      success: true,
      postData: itemToUpdate,
    });
  } catch (err) {
    return res.status(500).json({
      message:
        "Something went wrong , Post is not Deleted! ,please try again after sometimes",
      success: false,
    });
  }
};

//like comment controller

const likeComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { commentId, type } = req.body;

    if (!commentId) {
      return res.status(400).json({
        message: "Please add commentId",
        success: false,
      });
    }

    if (!type) {
      return res.status(400).json({
        message: "Please add type",
        success: false,
      });
    }

    const itemToUpdate = await postSchema.findOneAndUpdate(
      { _id: postId },
      {
        $set: {},
      },
      {
        new: true,
      }
    );
    console.log(
      "🚀 ~ file: post.controller.js:305 ~ likeComment ~ itemToUpdate:",
      itemToUpdate
    );

    if (!itemToUpdate) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Post Liked Successfully",
      success: true,
      postData: itemToUpdate,
    });
  } catch (err) {
    return res.status(500).json({
      message:
        "Something went wrong, post is Not Liked ,Please try again later",
      success: false,
    });
  }
};

//delete comment controller

const deleteComment = async (req, res) => {
  try {
    const { id } = req.userData;

    const { postId } = req.params;

    const { commentId } = req.body;

    if (!commentId) {
      return res.status(400).json({
        message: "Please add commentId",
        success: false,
      });
    }

    const itemToUpdate = await postSchema.findOneAndUpdate(
      { _id: postId },
      {
        $pull: {
          comments: {
            commentId: commentId,
          },
        },
      },
      { new: true }
    );

    if (!itemToUpdate) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Comment Deleted Successfully",
      success: true,
      postData: itemToUpdate,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong , please try again after sometimes",
      success: false,
    });
  }
};

export {
  createPost,
  getAllPost,
  deletePost,
  editPost,
  likePost,
  createComment,
  deleteComment,
  likeComment,
  getPostByUser,
};
