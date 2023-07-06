import { Router } from "express";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  disLikePost,
  editPost,
  getAllPost,
  getPostByUser,
  likeComment,
  likePost,
} from "../Controllers/post.controller.js";
import checkAuth from "../middleware/check-auth.js";
import {
  addPostToBookmark,
  deleteFormBookmark,
  getBookMarkedPosts,
} from "../Controllers/bookmark.controller.js";

const Routers = Router();

Routers.get("/getallpost", checkAuth, getAllPost);
Routers.get("/getpostbyuser/:userId", checkAuth, getPostByUser);
Routers.get("/getbookmarkedpost", checkAuth, getBookMarkedPosts);
Routers.post("/createpost", checkAuth, createPost);
Routers.post("/addtobookmark/:postId", checkAuth, addPostToBookmark);
Routers.patch("/createcommnet/:postId", checkAuth, createComment);
Routers.patch("/deletecommnet/:postId", checkAuth, deleteComment);
Routers.patch("/editpost/:postId", checkAuth, editPost);
Routers.patch("/like/:postId", checkAuth, likePost);
Routers.patch("/dislike/:postId", checkAuth, disLikePost);
Routers.patch("/likecomment/:postId", checkAuth, likeComment);
Routers.delete("/deletepost/:postId", checkAuth, deletePost);
Routers.delete("/deletebookmarkpost/:postId", checkAuth, deleteFormBookmark);

export default Routers;
