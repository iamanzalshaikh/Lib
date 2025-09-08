import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaBook, FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const Add = () => {
  const { serverUrl } = useContext(AuthContext);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittingBookId, setSubmittingBookId] = useState(null);

  // Fetch returned books
  useEffect(() => {
    const fetchReturnedBooks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${serverUrl}/api/member/books/returned`,
          { withCredentials: true }
        );

        // Remove duplicates using Map
        const uniqueBooks = Array.from(
          new Map(data.map(book => [book._id, book])).values()
        );

        setReturnedBooks(Array.isArray(uniqueBooks) ? uniqueBooks : []);
      } catch (error) {
        console.error("Error fetching returned books:", error);
        toast.error("Error fetching returned books");
        setReturnedBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReturnedBooks();
  }, [serverUrl]);

  const handleStarClick = (bookId, rating) => {
    setReviewData(prev => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        rating
      }
    }));
  };

  const handleCommentChange = (bookId, comment) => {
    setReviewData(prev => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        comment
      }
    }));
  };

  const handleReviewSubmit = async (bookId) => {
    const rating = reviewData[bookId]?.rating;
    const comment = reviewData[bookId]?.comment;

    if (!rating) {
      toast.error("Please provide a rating");
      return;
    }
    if (!comment || comment.trim() === "") {
      toast.error("Please provide a comment");
      return;
    }

    try {
      setSubmittingBookId(bookId);
      await axios.post(
        `${serverUrl}/api/review`,
        { bookId, rating, comment: comment.trim() },
        { withCredentials: true }
      );
      toast.success("Review submitted!");

      // Reset only the review form, keep the book
      setReviewData(prev => ({
        ...prev,
        [bookId]: { rating: 0, comment: "" }
      }));
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingBookId(null);
    }
  };

  const renderStars = (bookId, currentRating = 0) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={`star-${bookId}-${star}`} // Ensure unique key
            type="button"
            onClick={() => handleStarClick(bookId, star)}
            className="text-lg transition-transform hover:scale-110"
          >
            {star <= currentRating ? (
              <FaStar className="text-yellow-500" />
            ) : (
              <FaRegStar className="text-gray-300 hover:text-yellow-400" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Add Reviews</h1>
        <p className="text-gray-600 mb-6">Review books you have returned</p>

        {loading ? (
          <p className="text-center text-gray-500">Loading returned books...</p>
        ) : returnedBooks.length > 0 ? (
          <div className="space-y-4">
            {returnedBooks.map((book) => {
              const currentRating = reviewData[book._id]?.rating || 0;
              const currentComment = reviewData[book._id]?.comment || "";
              const isSubmitting = submittingBookId === book._id;

              return (
                <div
                  key={`book-${book._id}`} // Unique stable key
                  className="bg-white p-4 rounded-md shadow-sm border flex gap-4"
                >
                  <div className="w-20 h-28 bg-gray-200 flex items-center justify-center rounded">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <FaBook className="text-2xl text-gray-500" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>

                    <div className="mb-2">
                      {renderStars(book._id, currentRating)}
                    </div>

                    <textarea
                      value={currentComment}
                      onChange={(e) => handleCommentChange(book._id, e.target.value)}
                      placeholder="Write your review..."
                      className="w-full border rounded p-2 text-sm"
                      rows="2"
                    />

                    <button
                      onClick={() => handleReviewSubmit(book._id)}
                      disabled={
                        isSubmitting || currentRating === 0 || !currentComment.trim()
                      }
                      className={`mt-2 px-4 py-1 text-sm rounded-md ${
                        isSubmitting || currentRating === 0 || !currentComment.trim()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No returned books to review.</p>
        )}
      </div>
    </div>
  );
};

export default Add;
