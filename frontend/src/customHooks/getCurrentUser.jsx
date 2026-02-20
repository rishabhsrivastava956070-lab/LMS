import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const serverUrl = "https://lms-84yp.onrender.com"; // 🔥 production backend

const GetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/currentuser`,
          { withCredentials: true } // 🔥 REQUIRED for cookies
        );

        dispatch(setUserData(result.data));
        console.log("Current user:", result.data);
      } catch (error) {
        console.error("Current user error:", error);
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, [dispatch]);

  return null;
};

export default GetCurrentUser;
