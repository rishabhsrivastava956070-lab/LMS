import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

import Course from "../models/courseModel.js";
import User from "../models/userModel.js";

dotenv.config();

/* ----------------------------------
   Razorpay Instance
----------------------------------- */
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ----------------------------------
   CREATE ORDER
----------------------------------- */
export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const options = {
      amount: Number(course.price) * 100, // ₹ → paisa
      currency: "INR",
      receipt: courseId.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    // 🔴 Send flat response for frontend
    return res.status(200).json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ----------------------------------
   VERIFY PAYMENT & ENROLL USER
----------------------------------- */
export const verifyPayment = async (req, res) => {
  try {
    console.log("VERIFY BODY:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courseId ||
      !userId
    ) {
      return res.status(400).json({ message: "Payment details missing" });
    }

    /* -----------------------------
       Verify Razorpay Signature
    ------------------------------ */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    /* -----------------------------
       Fetch User & Course
    ------------------------------ */
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    /* -----------------------------
       Prevent Duplicate Enrollment
    ------------------------------ */
    const alreadyEnrolled = user.enrolledCourses.some(
      (id) => id.toString() === courseId.toString()
    );

    if (!alreadyEnrolled) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    const alreadyStudent = course.enrolledStudents.some(
      (id) => id.toString() === userId.toString()
    );

    if (!alreadyStudent) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    /* -----------------------------
       Success Response
    ------------------------------ */
    return res.status(200).json({
      success: true,
      message: "Payment verified & enrollment successful",
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
