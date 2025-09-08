import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";

const Home = () => {
  const { userdata } = useContext(userDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userdata) {
      // 🚀 redirect guests to login page
      navigate("/login");
    } else if (userdata.role === "admin") {
      navigate("/admin/dashboard");
    } else if (userdata.role === "member") {
      navigate("/member/mybooks");
    }
  }, [userdata, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-2xl font-bold">
        Welcome {userdata?.name || "Guest"}!
      </h2>
    </div>
  );
};

export default Home;
