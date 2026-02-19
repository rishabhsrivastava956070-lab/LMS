import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const GetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get("/api/user/currentuser");
        dispatch(setUserData(result.data));
        console.log("Current user:", result.data);
      } catch (error) {
        console.error(error);
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, [dispatch]);

  return null; // 👈 important
};

export default GetCurrentUser;
