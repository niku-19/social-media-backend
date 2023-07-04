import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import AuthRoutes from "./Routes/Auth.Routes.js";
import UserRoutes from "./Routes/User.Routes.js";
import PostRoutes from "./Routes/Post.routes.js";
import cors from "cors";
import "./Database/init.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser({ limit: "50mb" }));

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/v1/api", AuthRoutes);
app.use("/v1/api", UserRoutes);
app.use("/v1/api", PostRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
