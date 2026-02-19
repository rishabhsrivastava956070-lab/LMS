import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourseData } from "../redux/courseSlice";
import { toast } from "react-toastify";

const GetCreatorCourseData = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const getCreatorData = async () => {
      try {
        const result = await axios.get("/api/course/getcreatorcourses");
        dispatch(setCreatorCourseData(result.data));
        console.log("Creator courses:", result.data);
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data?.message || "Failed to load creator courses"
        );
      }
    };

    getCreatorData();
  }, [userData, dispatch]);

  return null; // 👈 this component only fetches data
};

export default GetCreatorCourseData;
