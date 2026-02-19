import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import { IoMdPerson } from "react-icons/io";
import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Nav = () => {
  const [showHam, setShowHam] = useState(false);
  const [showPro, setShowPro] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      dispatch(setUserData(null));
      toast.success("Logout successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // 🔑 Avatar Renderer (fixes empty src warning)
  const renderAvatar = () => {
    if (userData?.photoUrl && userData.photoUrl.trim() !== "") {
      return (
        <img
          src={userData.photoUrl}
          alt="profile"
          className="w-full h-full rounded-full object-cover"
        />
      );
    }

    return (
      <div className="w-full h-full rounded-full flex items-center justify-center bg-black text-white">
        {userData?.name?.slice(0, 1).toUpperCase()}
      </div>
    );
  };

  return (
    <>
      {/* =================== TOP NAVBAR =================== */}
      <div className="w-full h-[70px] fixed top-0 px-5 py-2 flex items-center justify-between bg-[#00000047] z-10">

        {/* Logo */}
        <img
          src={logo}
          alt="logo"
          className="w-[60px] rounded border-2 border-white cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4">

          {/* Avatar */}
          {userData ? (
            <div
              className="w-[50px] h-[50px] rounded-full border-2 border-white cursor-pointer"
              onClick={() => setShowPro(!showPro)}
            >
              {renderAvatar()}
            </div>
          ) : (
            <IoMdPerson
              className="w-[50px] h-[50px] fill-white cursor-pointer border-2 border-white rounded-full p-2"
              onClick={() => navigate("/login")}
            />
          )}

          {/* Dashboard */}
          {userData?.role === "educator" && (
            <button
              className="px-5 py-2 bg-black text-white border-2 border-white rounded-lg"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          )}

          {/* Login / Logout */}
          {!userData ? (
            <button
              className="px-5 py-2 bg-black text-white border-2 border-white rounded-lg"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <button
              className="px-5 py-2 bg-white text-black rounded-lg"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <GiHamburgerMenu
          className="w-8 h-8 fill-white cursor-pointer lg:hidden"
          onClick={() => setShowHam(true)}
        />
      </div>

      {/* =================== PROFILE DROPDOWN =================== */}
      {showPro && userData && (
        <div className="absolute top-[80px] right-[20px] bg-white border rounded-lg p-4 flex flex-col gap-3 z-20">
          <button onClick={() => navigate("/profile")}>My Profile</button>
          <button onClick={() => navigate("/enrolledcourses")}>My Courses</button>
        </div>
      )}

      {/* =================== MOBILE MENU =================== */}
      <div
        className={`fixed inset-0 bg-[#000000d6] flex flex-col items-center justify-center gap-5 z-20 transition-transform ${
          showHam ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <GiSplitCross
          className="absolute top-5 right-5 w-8 h-8 fill-white cursor-pointer"
          onClick={() => setShowHam(false)}
        />

        {userData && (
          <div className="w-[60px] h-[60px] rounded-full border-2 border-white">
            {renderAvatar()}
          </div>
        )}

        <button onClick={() => navigate("/profile")}>My Profile</button>
        <button onClick={() => navigate("/enrolledcourses")}>My Courses</button>

        {userData?.role === "educator" && (
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        )}

        {!userData ? (
          <button onClick={() => navigate("/login")}>Login</button>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </>
  );
};

export default Nav;
