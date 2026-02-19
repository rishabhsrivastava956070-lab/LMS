import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAllReview } from "../redux/reviewSlice";

const GetAllReviews = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const result = await axios.get("/api/review/allReview");
        dispatch(setAllReview(result.data));
        console.log("All reviews:", result.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllReviews();
  }, [dispatch]);

  return null; // 👈 required
};

export default GetAllReviews;
