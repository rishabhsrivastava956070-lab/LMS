import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCourseData } from "../redux/courseSlice";

const serverUrl = "https://lms-84yp.onrender.com"; // 🔥 backend URL

const GetCourseData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllPublishedCourse = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/getpublishedcoures`
        );

        dispatch(setCourseData(result.data));
        console.log("Published courses:", result.data);
      } catch (error) {
        console.error("Published course error:", error);
      }
    };

    getAllPublishedCourse();
  }, [dispatch]);

  return null;
};

export default GetCourseData;
