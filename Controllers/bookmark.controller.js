import postSchema from "../models/post-model.js";
import bookmarkModel from "../models/bookmark-model.js";

const addPostToBookmark = async (req, res) => {
  try {
    const { id } = req.userData;

    const { postId } = req.params;

    if (!postId)
      return res.status(400).json({
        message: "Please add postId",
        success: false,
        data: null,
      });

    const bookmarkedPost = await postSchema.findByIdAndUpdate(
      postId,
      {
        $push: {
          bookMarkedBy: id,
        },
      },
      { new: true }
    );

    const alreadyBookMarkedPost = await bookmarkModel.findOne({
      post_id: postId,
      user_id: id,
    });

    if (alreadyBookMarkedPost) {
      return res.status(400).json({
        message: "Post already bookmarked",
        success: false,
        data: null,
      });
    }

    if (!bookmarkedPost)
      return res.status(400).json({
        message: "Post not found",
        success: false,
        data: null,
      });

    const itemToUpdate = new bookmarkModel({
      post_id: postId,
      user_id: id,
    });

    const result = await itemToUpdate.save();

    if (!result) {
      return res.status(400).json({
        message: "Post not added to bookmark",
        success: false,
        data: null,
      });
    }

    return res.status(200).json({
      message: "Post added to bookmark",
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: "post not added to bookmark",
      success: false,
      data: null,
    });
  }
};

const getBookMarkedPosts = async (req, res) => {
  try {
    const { id } = req.userData;

    if (!id) {
      return res.status(400).json({
        message: "Please Login to get bookmarked posts",
        success: false,
        data: null,
      });
    }

    const bookmarkedPosts = await bookmarkModel
      .find({ user_id: id })
      .populate({
        path: "post_id",
        model: "Post",
      })
      .populate({
        path: "user_id",
        model: "User",
      });

    if (!bookmarkedPosts) {
      return res.status(400).json({
        message: "No bookmarked posts found",
        success: false,
        data: null,
      });
    }

    return res.status(200).json({
      message: "Bookmarked posts found",
      success: true,
      data: bookmarkedPosts,
    });
  } catch (err) {
    return res.status(500).json({
      message: "post not added to bookmark",
      success: false,
      data: null,
    });
  }
};

const deleteFormBookmark = async (req, res) => {
  try {
    const { id } = req.userData;

    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        message: "Please add postId to remove post from bookmark",
        success: false,
        data: null,
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Please Login to delete bookmarked posts",
        success: false,
        data: null,
      });
    }

    const postToRemoveFromBookmark = await bookmarkModel.findOneAndDelete({
      post_id: postId,
      user_id: id,
    });

    if (!postToRemoveFromBookmark) {
      return res.status(400).json({
        message: "No bookmarked posts found",
        success: false,
        data: null,
      });
    }

    if (postToRemoveFromBookmark) {
      const bookmarkedPost = await postSchema.findByIdAndUpdate(
        postId,
        {
          $pull: {
            bookMarkedBy: id,
          },
        },
        { new: true }
      );
    }

    return res.status(200).json({
      message: "Bookmarked posts found",
      success: true,
      data: postToRemoveFromBookmark,
    });
  } catch (err) {
    return res.status(500).json({
      message: "post is not removed from the bookmark",
      success: false,
      data: null,
    });
  }
};

export { addPostToBookmark, getBookMarkedPosts, deleteFormBookmark };
