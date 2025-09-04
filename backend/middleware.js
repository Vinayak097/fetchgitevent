import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided."});
  }
  try {  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
