// src/pages/Admin/AllReviews.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaBook, FaUser, FaStar, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const AllReviews = () => {
  const { serverUrl } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [serverUrl]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${serverUrl}/api/review/admin/all`, {
        withCredentials: true,
      });
      setReviews(data);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      setDeletingId(reviewId);
      await axios.delete(`${serverUrl}/api/review/admin/${reviewId}`, {
        withCredentials: true,
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={`star-${star}`}
          className={`text-sm ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">All Book Reviews</h2>
        <p className="text-gray-600 mb-6">Manage all reviews submitted by members</p>

        {loading ? (
          <p className="text-center text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews found.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white p-4 rounded-lg shadow-sm border flex gap-4"
              >
                <div className="w-20 h-28 bg-gray-200 flex items-center justify-center rounded">
                  {rev.book?.coverImage ? (
                    <img
                      src={rev.book.coverImage}
                      alt={rev.book?.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <FaBook className="text-2xl text-gray-500" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{rev.book?.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Author:</strong> {rev.book?.author}
                  </p>
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
                    <FaUser className="text-gray-500" />
                    {rev.user?.name} ({rev.user?.email})
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(rev.rating)}
                    <span className="text-sm text-gray-600">{rev.rating} / 5</span>
                  </div>

                  <p className="text-gray-700 text-sm mb-2">{rev.comment}</p>

                  <button
                    onClick={() => handleDeleteReview(rev._id)}
                    disabled={deletingId === rev._id}
                    className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md ${
                      deletingId === rev._id
                        ? "bg-gray-300 text-gray-500"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    <FaTrash className="text-xs" />
                    {deletingId === rev._id ? "Deleting..." : "Delete Review"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReviews;
