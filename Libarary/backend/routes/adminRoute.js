import express from "express";
import { addBook, deleteBook , getAllBooks, getAllMembers, getDashboard, updateBook } from "../controller/adminController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js"; 

const adminRouter = express.Router();



// Routes
adminRouter.post("/books", isAuth,   upload.single("coverImage"), addBook); // Add new book
adminRouter.put("/books/:id", isAuth, upload.single("coverImage"), updateBook);
adminRouter.delete("/books/:id", isAuth , deleteBook); // Delete book
adminRouter.get("/books", isAuth , getAllBooks); // Get all books
adminRouter.get("/members", isAuth , getAllMembers); // Get all members



//Dashbaord
adminRouter.get("/dashboard", isAuth ,  getDashboard); //Dashboard 
export default adminRouter;
