import express from "express";
import { login, logout, signup } from "../controller/userController.js";

const userRouter = express.Router();

// Auth routes
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout); 

export default userRouter;
