import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import defaultAvatar from "../assets/empty.jpg";

const ReviewCard = ({ text, name, image, rating = 0, role = "Student" }) => {
  const hasValidImage =
    typeof image === "string" && image.trim().length > 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 max-w-sm w-full">
      
      {/* ⭐ Rating */}
      <div className="flex items-center mb-3 text-yellow-400 text-sm">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
      </div>

      {/* 💬 Review */}
      <p className="text-gray-700 text-sm mb-5">
        {text || "No review provided."}
      </p>

      {/* 👤 User Info */}
      <div className="flex items-center gap-3">
        <img
          src={hasValidImage ? image : defaultAvatar}
          alt={name || "User"}
          className="w-10 h-10 rounded-full object-cover"
          loading="lazy"
        />

        <div>
          <h4 className="font-semibold text-gray-800 text-sm">
            {name || "Anonymous"}
          </h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
