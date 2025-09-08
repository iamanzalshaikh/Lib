// Frontend - MyBooks.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaBook, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const MyBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { serverUrl } = useContext(AuthContext);

  // 📌 Fetch books borrowed by current user only
  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/member/borrowed-books`, {
        withCredentials: true,
      });
      setBorrowedBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
      toast.error("Error fetching your books");
      setBorrowedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Return a book
  const returnBook = async (id) => {
    if (!window.confirm("Are you sure you want to return this book?")) return;
    
    try {
      await axios.put(`${serverUrl}/api/member/books/${id}/return`, {}, {
        withCredentials: true,
      });
      toast.success("Book returned successfully!");
      fetchBorrowedBooks(); // Refresh the list
    } catch (err) {
      console.error("Error returning book:", err);
      toast.error("Failed to return book");
    }
  };

  // 📌 Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Books</h1>
          <p className="text-gray-600">Books you have currently borrowed from the library</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <span className="text-gray-600">Loading your books...</span>
            </div>
          </div>
        ) : borrowedBooks.length > 0 ? (
          <div className="space-y-4">
            {borrowedBooks.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  
                  {/* Book Cover */}
                  <div className="flex-shrink-0">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <FaBook className="text-2xl text-blue-400" />
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{book.author}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <FaCalendarAlt className="mr-2 text-xs" />
                        <span>Borrowed: {formatDate(book.borrowedDate)}</span>
                      </div>
                      
                      {book.ISBN && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <FaBook className="mr-2 text-xs" />
                          <span>ISBN: {book.ISBN}</span>
                        </div>
                      )}

                      {book.genre && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <span className="mr-2">📚</span>
                          <span>Genre: {book.genre}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Currently Borrowed by You
                      </span>
                    </div>
                  </div>

                  {/* Return Button */}
                  <div className="flex-shrink-0 flex items-center">
                    <button
                      onClick={() => returnBook(book._id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium shadow-md"
                    >
                      <FaCheckCircle className="text-sm" />
                      Return Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <FaBook className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No borrowed books</h3>
              <p className="text-gray-500 mb-4">
                You don't have any books currently borrowed from the library.
              </p>
              <p className="text-gray-400 text-sm">
                Visit the Books section to browse and borrow books.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooks;