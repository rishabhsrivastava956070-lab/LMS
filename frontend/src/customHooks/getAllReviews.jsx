import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAllReview } from "../redux/reviewSlice";

const serverUrl = "https://lms-84yp.onrender.com"; // 🔥 backend URL

const GetAllReviews = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/review/allReview`
        );

        dispatch(setAllReview(result.data));
        console.log("All reviews:", result.data);
      } catch (error) {
        console.error("All reviews error:", error);
      }
    };

    fetchAllReviews();
  }, [dispatch]);

  return null;
};

export default GetAllReviews;
