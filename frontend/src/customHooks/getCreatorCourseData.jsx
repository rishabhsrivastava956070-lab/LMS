import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourseData } from "../redux/courseSlice";
import { toast } from "react-toastify";

const serverUrl = "https://lms-84yp.onrender.com"; // 🔥 backend URL

const GetCreatorCourseData = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const getCreatorData = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/getcreatorcourses`,
          { withCredentials: true } // 🔥 required for auth cookie
        );

        dispatch(setCreatorCourseData(result.data));
        console.log("Creator courses:", result.data);
      } catch (error) {
        console.error("Creator courses error:", error);
        toast.error(
          error?.response?.data?.message || "Failed to load creator courses"
        );
      }
    };

    getCreatorData();
  }, [userData, dispatch]);

  return null;
};

export default GetCreatorCourseData;
