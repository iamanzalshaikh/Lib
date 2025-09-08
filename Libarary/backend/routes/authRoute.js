import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser } from "../controller/authController.js"




let  authRouter = express.Router()

authRouter.get("/getCurrentUser", isAuth, getCurrentUser)



export default authRouter

