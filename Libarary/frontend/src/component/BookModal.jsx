import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const BookModal = ({ close, fetchBooks, editBook }) => {
  const [formData, setFormData] = useState({
    title: editBook?.title || "",
    author: editBook?.author || "",
    ISBN: editBook?.ISBN || "",
    genre: editBook?.genre || "",
    availability: editBook?.availability || "available",
  });

  const [file, setFile] = useState(null);
  const { serverUrl } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (file) {
        data.append("coverImage", file); // ✅ must match multer field name
      }

      let res;
      if (editBook) {
        res = await axios.put(
          `${serverUrl}/api/admin/books/${editBook._id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        toast.success("Book updated successfully");
      } else {
        res = await axios.post(`${serverUrl}/api/admin/books`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        toast.success("Book added successfully");
      }

      console.log("Book API response:", res.data);

      fetchBooks();
      close();
      setFile(null); // ✅ reset file
    } catch (err) {
      console.error("Book save error:", err.response?.data || err.message);
      toast.error("Error saving book");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {editBook ? "Edit Book" : "Add New Book"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="ISBN"
            placeholder="ISBN"
            value={formData.ISBN}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="reserved">Reserved</option>
          </select>

          {/* File Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded"
          />

          {/* Preview Image if exists */}
          {(file || editBook?.coverImage) && (
            <img
              src={file ? URL.createObjectURL(file) : editBook.coverImage}
              alt="Preview"
              className="w-24 h-32 object-cover rounded mx-auto border"
            />
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="bg-gray-400 px-4 py-2 rounded text-white"
              onClick={() => {
                close();
                setFile(null);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editBook ? "Update" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
