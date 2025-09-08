import express from "express";
import { borrowBook, getAvailableBooks, getBorrowedBooks, reserveBook, returnBook, searchBooks, getReturnedBooks } from "../controller/memberController.js";
import isAuth from "../middleware/isAuth.js";


const memberRouter = express.Router();

memberRouter.get("/books", isAuth, getAvailableBooks);        // View available books
memberRouter.put("/books/:id/borrow", isAuth, borrowBook);    // Borrow book
memberRouter.put("/books/:id/return", isAuth, returnBook);    // Return book
memberRouter.put("/books/:id/reserve", isAuth, reserveBook);  // Reserve book (optional)
memberRouter.get("/books/search", isAuth, searchBooks);  //// Search available books
memberRouter.get("/borrowed-books", isAuth, getBorrowedBooks);


memberRouter.get("/books/returned", isAuth, getReturnedBooks);


export default memberRouter;
