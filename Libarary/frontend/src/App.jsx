import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { userDataContext } from "./context/userContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./admin/Dashboard";
import Books from "./admin/Books";
import Member from "./admin/Member";
import AllBooks from "./member/AllBooks";
import MyBooks from "./member/MyBooks";

// Nav
import Nav from "./component/Nav";
import Review from "./admin/Review";
import Add from "./member/Add";

const App = () => {
  const { userdata } = useContext(userDataContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Show navbar if logged in */}
      {userdata && <Nav />}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!userdata ? <Login /> : <Navigate to={userdata.role === "admin" ? "/admin/dashboard" : "/member/mybooks"} />} />
        <Route path="/signup" element={!userdata ? <Signup /> : <Navigate to={userdata.role === "admin" ? "/admin/dashboard" : "/member/mybooks"} />} />

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={userdata?.role === "admin" ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/books" element={userdata?.role === "admin" ? <Books /> : <Navigate to="/login" />} />
        <Route path="/admin/member" element={userdata?.role === "admin" ? <Member /> : <Navigate to="/login" />} />
        <Route path="/admin/review" element={userdata?.role === "admin" ? <Review/> : <Navigate to="/login" />} />



        {/* Member routes */}
        <Route path="/member/mybooks" element={userdata?.role === "member" ? <MyBooks /> : <Navigate to="/login" />} />
        <Route path="/member/allbooks" element={userdata?.role === "member" ? <AllBooks /> : <Navigate to="/login" />} />
        <Route path="/member/add" element={userdata?.role === "member" ? <Add /> : <Navigate to="/login" />} />

        

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
