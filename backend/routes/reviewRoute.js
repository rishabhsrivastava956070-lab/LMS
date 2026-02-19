import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  addReview,
  getAllReviews,
  getCourseReviews,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// 🔐 Add review (logged-in users only)
reviewRouter.post("/givereview", isAuth, addReview);

// 📚 Get reviews of a course
reviewRouter.get("/course/:courseId", getCourseReviews);

// 🌍 Get all reviews (homepage / admin)
reviewRouter.get("/allReview", getAllReviews);

export default reviewRouter;
