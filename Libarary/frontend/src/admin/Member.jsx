import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaBook } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Member = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { serverUrl } = useContext(AuthContext);

  // Fetch all members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/admin/members`, {
        withCredentials: true,
      });
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching members:", err);
      toast.error("Failed to fetch members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members by search
  const filteredMembers = members.filter((member) => 
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Library Members</h1>
      </div>

      {/* Search bar */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search members..."
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          defaultValue=""
        >
          <option value="">All Members</option>
        </select>
      </div>

      {/* Members table */}
      {loading ? (
        <div className="text-center py-12">Loading members...</div>
      ) : filteredMembers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Avatar
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Member Since
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Borrowed Books
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Current Books
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-400 text-sm" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{member.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400 text-xs" />
                      {member.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {member.createdAt 
                      ? new Date(member.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : "—"
                    }
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <FaBook className="text-blue-500 text-xs" />
                      <span className="font-medium text-blue-600">
                        {member.borrowedBooksCount || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {member.borrowedBooks && member.borrowedBooks.length > 0 ? (
                      <div className="space-y-1">
                        {member.borrowedBooks.map((book, index) => (
                          <div key={index} className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                            {book.title || book.name || "Unknown Book"}
                          </div>
                        ))}
                      </div>
                    ) : member.currentBook ? (
                      <div className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                        {member.currentBook.title}
                      </div>
                    ) : (
                      <span className="text-gray-500">No books</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No members found</div>
      )}
    </div>
  );
};

export default Member;