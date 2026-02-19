import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    console.log("COOKIES RECEIVED:", req.cookies);

    // 1️⃣ Check cookies exist
    if (!req.cookies) {
      return res.status(401).json({ message: "Cookies not found" });
    }

    // 2️⃣ Extract token
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   if (!decoded || !decoded.userId) {
  return res.status(401).json({ message: "Invalid token" });
}

req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default isAuth;
