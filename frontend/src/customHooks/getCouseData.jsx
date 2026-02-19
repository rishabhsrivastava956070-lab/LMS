import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../redux/courseSlice";

const GetCourseData = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const getAllPublishedCourse = async () => {
      try {
        const result = await axios.get("/api/course/getpublishedcoures");
        dispatch(setCourseData(result.data));
        console.log("Published courses:", result.data);
      } catch (error) {
        console.error(error);
      }
    };

    getAllPublishedCourse();
  }, [dispatch]);

  return null; // 👈 important
};

export default GetCourseData;
