import Review from "../models/reviewModel.js";
import Course from "../models/courseModel.js";

/* --------------------------------
   ADD REVIEW
--------------------------------- */
export const addReview = async (req, res) => {
  try {
    const { rating, comment, courseId } = req.body;
    const userId = req.userId;

    // 🔐 Auth check
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Validation
    if (!courseId || !rating) {
      return res.status(400).json({
        message: "Course ID and rating are required",
      });
    }

    // 🔍 Check course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🛑 Prevent duplicate review
    const alreadyReviewed = await Review.findOne({
      course: courseId,
      user: userId,
    });

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this course" });
    }

    // 📝 Create review
    const review = await Review.create({
      course: courseId,
      user: userId,
      rating,
      comment,
    });

    // 🔗 Attach review to course
    if (!course.reviews) {
      course.reviews = [];
    }

    course.reviews.push(review._id);
    await course.save();

    return res.status(201).json(review);
  } catch (error) {
    console.error("Add Review Error:", error);
    return res.status(500).json({
      message: "Failed to add review",
    });
  }
};

/* --------------------------------
   GET REVIEWS OF A COURSE
--------------------------------- */
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID required" });
    }

    const reviews = await Review.find({ course: courseId })
      .populate("user", "name photoUrl role")
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Get Course Reviews Error:", error);
    return res.status(500).json({ message: "Error fetching reviews" });
  }
};

/* --------------------------------
   GET ALL REVIEWS
--------------------------------- */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name photoUrl role")
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Get All Reviews Error:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
