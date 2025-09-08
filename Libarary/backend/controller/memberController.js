import Book from "../model/bookModel.js";
import User from "../model/userModel.js";


//  View available books
export const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({ availability: "available" });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: `Error fetching available books: ${error.message}` });
  }
};

//  Borrow a book
export const borrowBook = async (req, res) => {
  try {
    const { id } = req.params; // book ID
    const userId = req.userId; // from isAuth middleware

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availability !== "available") {
      return res.status(400).json({ message: "Book not available" });
    }

    book.availability = "borrowed";
    book.borrowedBy = userId;
    book.borrowedDate = new Date();
    await book.save();

    await User.findByIdAndUpdate(userId, {
      $inc: { borrowedBooksCount: 1, totalBorrowed: 1 },
    });

    res.status(200).json({ message: "Book borrowed successfully", book });
  } catch (error) {
    res.status(500).json({ message: `Error borrowing book: ${error.message}` });
  }
};


export const getBorrowedBooks = async (req, res) => {
  try {
    const userId = req.userId;
    const books = await Book.find({ borrowedBy: userId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};



// 🔄 Return a book
// export const returnBook = async (req, res) => {
//   try {
//     const { id } = req.params; // book ID
//     const userId = req.userId;

//     const book = await Book.findById(id);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     if (book.borrowedBy?.toString() !== userId) {
//       return res.status(403).json({ message: "You didn’t borrow this book" });
//     }

//     // Set availability back to "available"
//     book.borrowedBy = null;
//     book.availability = "available"; // <-- FIXED HERE
//     book.borrowedDate = null;

//     await book.save();

//     return res.json({ message: "Book returned successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

export const getReturnedBooks = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("returnedBooks", "title author") // populate only what you need
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.returnedBooks || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching returned books" });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.borrowedBy?.toString() !== userId) {
      return res.status(403).json({ message: "You didn’t borrow this book" });
    }

    book.borrowedBy = null;
    book.availability = "available";
    await book.save();

    await User.findByIdAndUpdate(userId, {
      $push: { returnedBooks: id },
      $inc: { borrowedBooksCount: -1 }
    });

    res.json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error returning book" });
  }
};









//  Reserve a book
export const reserveBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availability !== "available") {
      return res.status(400).json({ message: "Book cannot be reserved" });
    }

    book.availability = "reserved";
    book.borrowedBy = userId;
    await book.save();

    res.status(200).json({ message: "Book reserved successfully", book });
  } catch (error) {
    res.status(500).json({ message: `Error reserving book: ${error.message}` });
  }
};


export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query; // search string from frontend

    let filter = { availability: "available" }; // only show available books

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ];
    }

    const books = await Book.find(filter);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: `Error searching books: ${error.message}` });
  }
};





