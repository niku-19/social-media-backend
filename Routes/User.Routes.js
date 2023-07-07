import { Router } from "express";
import {
  profile,
  editProfile,
  getAllUser,
  getUserById,
  followUser,
  friends,
  userToFollow,
  unFolloweUser,
  deleteAccount,
} from "../Controllers/user.controller.js";
import checkAuth from "../middleware/check-auth.js";

const Routers = Router();

Routers.get("/profile", checkAuth, profile);
Routers.get("/getalluser", checkAuth, getAllUser);
Routers.get("/getprofilebyid/:userId", checkAuth, getUserById);
Routers.get("/getfriendsdetails", checkAuth, friends);
Routers.patch("/editprofile", checkAuth, editProfile);
Routers.post("/followuser/:userId", checkAuth, followUser);
Routers.post("/unfolloweUser/:userId", checkAuth, unFolloweUser);
Routers.get("/userToFollow", checkAuth, userToFollow);
Routers.delete("/delet-account", checkAuth, deleteAccount);

export default Routers;
