import { Router } from "express";
import { login, signup } from "../Controllers/auth.controller.js";

const Routers = Router();

Routers.post("/login", login);
Routers.post("/signup", signup);



export default Routers;