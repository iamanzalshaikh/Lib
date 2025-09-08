import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import BookModal from "../component/BookModal";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const { serverUrl } = useContext(AuthContext);

  // 📌 Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/admin/books`, {
        params: { query: search, status },
        withCredentials: true,
      });
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching books:", err);
      toast.error("Error fetching books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, status]);

  // 📌 Delete book
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`${serverUrl}/api/admin/books/${id}`, {
        withCredentials: true,
      });
      toast.success("Book deleted successfully");
      fetchBooks();
    } catch (err) {
      toast.error("Failed to delete book");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">

        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Books Management</h1>

        {/* Add New Book Button */}
        <div className="mb-6">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            onClick={() => {
              setEditBook(null);
              setModalOpen(true);
            }}
          >
            <FaPlus className="text-sm" />
            Add New Book
          </button>
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Books
              </label>
              <input
                type="text"
                placeholder="Search by title or author..."
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="sm:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="borrowed">Borrowed</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 text-sm">Loading books...</span>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden text-sm"
              >
                {/* Book Cover */}
                <div className="aspect-w-3 aspect-h-4 bg-gray-200">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}  // Display Cloudinary URL
                      alt={book.title}
                      className="w-full h-36 object-cover"
                    />
                  ) : (
                    <div className="w-full h-36 flex items-center justify-center bg-gray-200 text-gray-500">
                      <FaEdit className="text-xl" />
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-1">by {book.author}</p>
                  <p className="text-gray-500 mb-1">ISBN: {book.ISBN}</p>
                  <p className="text-gray-500 mb-2">Genre: {book.genre || "N/A"}</p>

                  {/* Availability Status */}
                  <div className="mb-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        book.availability === "available"
                          ? "bg-green-100 text-green-800"
                          : book.availability === "borrowed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {book.availability}
                    </span>
                  </div>

                  {/* Borrower Info */}
                  {book.borrowedBy && (
                    <p className="text-gray-500 mb-2 text-xs">
                      Borrowed by: {book.borrowedBy.name}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-1 pt-2 border-t">
                    <button
                      className="flex-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-xs"
                      onClick={() => {
                        setEditBook(book);
                        setModalOpen(true);
                      }}
                    >
                      <FaEdit className="text-xs" /> Edit
                    </button>
                    <button
                      className="flex-1 bg-red-50 text-red-600 px-2 py-1 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-xs"
                      onClick={() => handleDelete(book._id)}
                    >
                      <FaTrash className="text-xs" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <FaEdit className="mx-auto text-3xl text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-500 mb-3">
                {search || status
                  ? "Try adjusting your search or filter criteria."
                  : "Start by adding your first book to the library."}
              </p>
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                onClick={() => {
                  setEditBook(null);
                  setModalOpen(true);
                }}
              >
                <FaPlus className="text-sm" /> Add First Book
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <BookModal
            close={() => setModalOpen(false)}
            fetchBooks={fetchBooks}
            editBook={editBook}
          />
        )}
      </div>
    </div>
  );
};

export default AllBooks;
