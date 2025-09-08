import { uploadOnCloudinary } from "../config/cloudinary.js";
import Book from "../model/bookModel.js";
import User from "../model/userModel.js";
// ➕ Add new book
export const addBook = async (req, res) => {
  try {
    const { title, author, ISBN  } = req.body;


      // upload image if exists
    let coverImage = "";
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      coverImage = result;
    }

    // Check if book already exists
    const exists = await Book.findOne({ ISBN });
    if (exists) return res.status(400).json({ message: "Book already exists" });

    const book = await Book.create({ title, author, ISBN, coverImage });
    res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    res.status(500).json({ message: `Error adding book: ${error.message}` });
  }
};

// ✏️ Update book details
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Build update object
    const updateData = { ...req.body };

    // If a new cover image is uploaded
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      updateData.coverImage = result;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBook) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book updated successfully", updatedBook });
  } catch (error) {
    res.status(500).json({ message: `Error updating book: ${error.message}` });
  }
};

// ❌ Delete book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error deleting book: ${error.message}` });
  }
};

// 📚 View all books (Admin can see borrowed or available)
export const getAllBooks = async (req, res) => {
  try {
    const { status, query } = req.query;

    let filter = {};

    // Filter by status if provided
    if (status) filter.availability = status;

    // Search by title or author if query provided
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } }
      ];
    }

    const books = await Book.find(filter).populate("borrowedBy", "name email");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: `Error fetching books: ${error.message}` });
  }
};


//  View all members
export const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ role: "member" }).select("-password").lean();

    // Populate current borrowed book
    for (let member of members) {
      const book = await Book.findOne({ borrowedBy: member._id, availability: "borrowed" });
      member.currentBook = book || null;
    }

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: `Error fetching members: ${error.message}` });
  }
};

export const getDashboard = async (req, res) => {
  try {
    // req.userId is set by your isAuth middleware
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Count total books
    const totalBooks = await Book.countDocuments();

    // Count available books
    const availableBooks = await Book.countDocuments({ availability: "available" });

    // Count borrowed books
    const borrowedBooks = await Book.countDocuments({ availability: "borrowed" });

    // Count total members
    const totalMembers = await User.countDocuments({ role: "member" });

    res.status(200).json({
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalMembers,
    });
  } catch (error) {
    res.status(500).json({ message: `Error fetching dashboard: ${error.message}` });
  }
};

// export const forceReturnBook = async (req, res) => {
//   try {
//     const { bookId } = req.params;

//     const book = await Book.findById(bookId);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     book.availability = "available";
//     book.borrowedBy = null;
//     book.returnDate = new Date();
//     await book.save();

//     res.status(200).json({ message: "Book forcefully returned", book });
//   } catch (error) {
//     res.status(500).json({ message: `Error returning book: ${error.message}` });
//   }
// };
