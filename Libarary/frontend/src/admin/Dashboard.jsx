import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { BookOpen, Archive, Clock, Users } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; // make sure this provides serverUrl

const AdminDashboard = () => {
  const { serverUrl } = useContext(AuthContext); // get backend URL from context
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/admin/dashboard`, { withCredentials: true });
        setDashboardData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [serverUrl]); // re-run if serverUrl changes

  if (loading)
    return <p className="text-center mt-20 text-lg">Loading...</p>;

  if (error)
    return <p className="text-center mt-20 text-red-500">{error}</p>;

  const { totalBooks, availableBooks, borrowedBooks, totalMembers } = dashboardData;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded p-6 flex items-center space-x-4">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Total Books</p>
            <p className="text-2xl font-semibold">{totalBooks}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded p-6 flex items-center space-x-4">
          <Archive className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Available Books</p>
            <p className="text-2xl font-semibold">{availableBooks}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded p-6 flex items-center space-x-4">
          <Clock className="h-8 w-8 text-yellow-600" />
          <div>
            <p className="text-gray-500 text-sm">Borrowed Books</p>
            <p className="text-2xl font-semibold">{borrowedBooks}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded p-6 flex items-center space-x-4">
          <Users className="h-8 w-8 text-red-600" />
          <div>
            <p className="text-gray-500 text-sm">Total Members</p>
            <p className="text-2xl font-semibold">{totalMembers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

