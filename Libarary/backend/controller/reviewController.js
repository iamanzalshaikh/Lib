import Review from "../model/reviewModel.js";
import Book from "../model/bookModel.js";
import User from "../model/userModel.js";

// ✅ Member adds a review
export const addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.userId;

    // Optional: check if book exists
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const review = await Review.create({ book: bookId, user: userId, rating, comment });
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: `Error adding review: ${error.message}` });
  }
};

// ✅ Get all reviews for a book (member or admin)
export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ book: bookId }).populate("user", "name email");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: `Error fetching reviews: ${error.message}` });
  }
};

// ✅ Admin: get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const admin = await User.findById(req.userId);
    if (!admin || admin.role !== "admin") return res.status(403).json({ message: "Admin only" });

    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("book", "title author");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: `Error fetching all reviews: ${error.message}` });
  }
};



//delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
};