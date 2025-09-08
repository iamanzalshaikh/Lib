import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaSearch, FaBook, FaUser, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("available");
  const { serverUrl } = useContext(AuthContext);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/member/books?status=${filter}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

  //  Search books
  const searchBooks = async () => {
    if (!searchQuery.trim()) return fetchBooks();
    
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/member/books/search?query=${searchQuery}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error searching books:", err);
      toast.error("Error searching books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Borrow a book
  const borrowBook = async (id) => {
    try {
      await axios.put(`${serverUrl}/api/member/books/${id}/borrow`, {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Book borrowed successfully!");
      fetchBooks();
    } catch (err) {
      console.error("Error borrowing book:", err);
      toast.error("Failed to borrow book");
    }
  };

  //  Reserve a book
  const reserveBook = async (id) => {
    try {
      await axios.put(`${serverUrl}/api/member/books/${id}/reserve`, {}, {
        withCredentials: true,
      });
      toast.success("Book reserved successfully!");
      fetchBooks();
    } catch (err) {
      console.error("Error reserving book:", err);
      toast.error("Failed to reserve book");
    }
  };

  //  Handle search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchBooks();
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Library Books</h1>
          <p className="text-gray-600">Browse, search, and borrow books from our collection</p>
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Books
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
              </div>
            </div>
            
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="available">Available</option>
                <option value="borrowed">Borrowed</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={searchBooks}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <FaSearch className="text-sm" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Books Content */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <span className="text-gray-600">Loading books...</span>
            </div>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Book Cover */}
                <div className="relative">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                      <FaBook className="text-4xl text-blue-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        book.availability === "available"
                          ? "bg-green-500 text-white"
                          : book.availability === "borrowed"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {book.availability}
                    </span>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {book.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <FaUser className="mr-2 text-xs" />
                      <span>{book.author}</span>
                    </div>
                    
                    {book.ISBN && (
                      <p className="text-gray-500 text-xs">ISBN: {book.ISBN}</p>
                    )}
                    
                    {book.genre && (
                      <p className="text-gray-500 text-xs">Genre: {book.genre}</p>
                    )}
                    
                    {book.publishedDate && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <FaCalendarAlt className="mr-1" />
                        <span>{new Date(book.publishedDate).getFullYear()}</span>
                      </div>
                    )}
                  </div>

                  {/* Borrower Info */}
                  {book.borrowedBy && (
                    <div className="mb-4 p-2 bg-red-50 rounded-lg">
                      <p className="text-red-700 text-xs font-medium">
                        Currently borrowed by: {book.borrowedBy.name}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {book.availability === 'available' && (
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                        onClick={() => borrowBook(book._id)}
                      >
                        <FaBook className="text-xs" /> Borrow
                      </button>
                      <button
                        className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                        onClick={() => reserveBook(book._id)}
                      >
                        <FaCalendarAlt className="text-xs" /> Reserve
                      </button>
                    </div>
                  )}
                  
                  {book.availability !== 'available' && (
                    <div className="text-center">
                      <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
                        book.availability === 'borrowed' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {book.availability === 'borrowed' ? 'Currently Borrowed' : 'Reserved'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <FaBook className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filter !== 'available'
                  ? "Try adjusting your search query or filter criteria."
                  : "No books are currently available in the library."}
              </p>
              {searchQuery && (
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    setSearchQuery("");
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBooks;
