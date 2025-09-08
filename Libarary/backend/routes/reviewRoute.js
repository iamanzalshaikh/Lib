import express from "express";
import isAuth from "../middleware/isAuth.js";
import { addReview, getAllReviews, getReviewsByBook,  deleteReview } from '../controller/reviewController.js';


const reviewRouter = express.Router();

// Member adds a review
reviewRouter.post("/", isAuth, addReview);

// Get reviews for a specific book
reviewRouter.get("/book/:bookId", isAuth, getReviewsByBook);

// Admin gets all reviews
reviewRouter.get("/admin/all", isAuth, getAllReviews);

//delete
reviewRouter.delete("/admin/:id", isAuth  ,  deleteReview);

export default reviewRouter;
