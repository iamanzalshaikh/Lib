import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const Nav = () => {
  const { userdata, setUserData } = useContext(userDataContext);
  const { serverUrl } = useContext(AuthContext); // ✅ Use serverUrl from AuthContext
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!userdata) return null;

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/logout`, // ✅ Using serverUrl now
        {},
        { withCredentials: true }
      );
      console.log("Logout API response:", response.data);

      if (response.status === 200) {
        setUserData(null); // Clear user data
        toast.success("Logged out successfully");
        navigate("/login"); // Redirect only on success
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const userInitial = userdata.name?.charAt(0).toUpperCase() || "?";

  const links =
    userdata.role === "admin"
      ? [
          { name: "Dashboard", path: "/admin/dashboard" },
          { name: "Books", path: "/admin/books" },
          { name: "Member", path: "/admin/member" },
          { name: "Review", path: "/admin/review" },
        ]
      : [
          { name: "All Books", path: "/member/allbooks" },
          { name: "My Books", path: "/member/mybooks" },
          { name: "Add", path: "/member/add" },
        ];

  return (
    <nav className="bg-blue-600 text-white fixed w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Left - Links */}
        <div className="flex space-x-4 font-semibold items-center">
          <span
            className="text-lg font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            LibraryMS
          </span>
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className="hover:bg-blue-500 px-3 py-2 rounded transition"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right - User info */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="font-medium">{userdata.name}</div>
            <div className="text-xs">{userdata.role.toUpperCase()}</div>
          </div>
          <div className="h-8 w-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
            {userInitial}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
