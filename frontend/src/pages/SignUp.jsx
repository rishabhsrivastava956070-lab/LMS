import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import axios from "axios";
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const serverUrl = "http://localhost:8000";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔐 NORMAL SIGNUP
  const handleSignUp = async () => {
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }
    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password, role },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      toast.success("Signup successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔵 GOOGLE SIGNUP
  const googleSignUp = async () => {
    if (loading) return; // 🔒 prevent double popup
    setLoading(true);

    try {
      // 1️⃣ Firebase Google popup
      const response = await signInWithPopup(auth, provider);

      const user = response.user;
      if (!user?.email) {
        throw new Error("Google authentication failed");
      }

      // 2️⃣ Backend signup
      const result = await axios.post(
        `${serverUrl}/api/auth/googlesignup`,
        {
          name: user.displayName,
          email: user.email,
          role,
        },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      toast.success("Signup successful");
      navigate("/");
    } catch (error) {
      console.error("Google signup error:", error);

      // Ignore popup-close noise
      if (error.code === "auth/cancelled-popup-request") return;

      toast.error(error?.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center">
      <form
        className="w-[90%] md:w-[800px] h-[480px] bg-white shadow-xl rounded-2xl flex"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* LEFT */}
        <div className="md:w-[50%] w-full h-full flex flex-col items-center justify-center gap-3">
          <div className="text-center">
            <h1 className="font-semibold text-2xl">Let’s get Started</h1>
            <p className="text-gray-500">Create your account</p>
          </div>

          {/* NAME */}
          <div className="w-[80%]">
            <label className="font-semibold">Name</label>
            <input
              type="text"
              className="border w-full h-[35px] px-3"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div className="w-[80%]">
            <label className="font-semibold">Email</label>
            <input
              type="email"
              className="border w-full h-[35px] px-3"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="w-[80%] relative">
            <label className="font-semibold">Password</label>
            <input
              type={show ? "text" : "password"}
              className="border w-full h-[35px] px-3"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!show ? (
              <MdOutlineRemoveRedEye
                className="absolute right-3 bottom-2 cursor-pointer"
                onClick={() => setShow(true)}
              />
            ) : (
              <MdRemoveRedEye
                className="absolute right-3 bottom-2 cursor-pointer"
                onClick={() => setShow(false)}
              />
            )}
          </div>

          {/* ROLE */}
          <div className="flex w-[70%] justify-between">
            <span
              className={`px-3 py-1 border rounded-2xl cursor-pointer ${
                role === "student" ? "border-black" : "border-gray-400"
              }`}
              onClick={() => setRole("student")}
            >
              Student
            </span>
            <span
              className={`px-3 py-1 border rounded-2xl cursor-pointer ${
                role === "educator" ? "border-black" : "border-gray-400"
              }`}
              onClick={() => setRole("educator")}
            >
              Educator
            </span>
          </div>

          {/* SIGNUP BUTTON */}
          <button
            className="w-[80%] h-[40px] bg-black text-white rounded"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
          </button>

          {/* DIVIDER */}
          <div className="w-[80%] flex items-center gap-2">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-gray-500 text-sm">Or continue with</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {/* GOOGLE SIGNUP */}
          <button
            type="button"
            onClick={googleSignUp}
            disabled={loading}
            className="w-[80%] h-[40px] border border-black rounded flex items-center justify-center gap-2"
          >
            <img src={google} alt="google" className="w-[22px]" />
            <span className="text-gray-500">Google</span>
          </button>

          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <span
              className="underline cursor-pointer text-black"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-[50%] bg-black rounded-r-2xl hidden md:flex flex-col items-center justify-center">
          <img src={logo} alt="logo" className="w-28 mb-3" />
          <h2 className="text-white text-xl">VIRTUAL COURSES</h2>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
