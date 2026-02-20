import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import axios from "axios";
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const serverUrl = "https://lms-84yp.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔐 NORMAL LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("All fields are required");
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔵 GOOGLE LOGIN
  const googleLogin = async () => {
    try {
      // 1️⃣ Firebase popup
      const response = await signInWithPopup(auth, provider);

      const user = response.user;
      const name = user.displayName;
      const email = user.email;
      const role = "student";

      // 2️⃣ Backend signup/login
      const result = await axios.post(
        `${serverUrl}/api/auth/googlesignup`,
        { name, email, role },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error?.message || "Google login failed");
    }
  };

  return (
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center">
      <form
        className="w-[90%] md:w-[800px] h-[450px] bg-white shadow-xl rounded-2xl flex"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* LEFT */}
        <div className="md:w-[50%] w-full h-full flex flex-col items-center justify-center gap-4">
          <div className="text-center">
            <h1 className="font-semibold text-2xl">Welcome back</h1>
            <p className="text-gray-500">Login to your account</p>
          </div>

          {/* EMAIL */}
          <div className="w-[85%]">
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
          <div className="w-[85%] relative">
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

          {/* LOGIN BUTTON */}
          <button
            className="w-[80%] h-[40px] bg-black text-white rounded"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Login"}
          </button>

          <span
            className="text-sm cursor-pointer text-gray-600"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot your password?
          </span>

          {/* DIVIDER */}
          <div className="w-[80%] flex items-center gap-2">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-sm text-gray-500">Or continue with</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {/* GOOGLE LOGIN */}
          <div
            className="w-[80%] h-[40px] border rounded flex items-center justify-center gap-2 cursor-pointer"
            onClick={googleLogin}
          >
            <img src={google} alt="google" className="w-[22px]" />
            <span className="text-gray-600">Google</span>
          </div>

          <p className="text-gray-600 text-sm">
            Don’t have an account?{" "}
            <span
              className="underline cursor-pointer text-black"
              onClick={() => navigate("/signup")}
            >
              Sign up
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

export default Login;


