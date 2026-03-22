const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader||authHeader.startsWith("Bearer ")===false) 
    return res.status(401).json({ msg: "No token" });

  const token = authHeader.split(" ")[1]; 
  
  console.log("Auth header received:", req.headers.authorization);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
    console.log("Decoded token:", decoded);
    req.user = decoded; 
    next();
  } 
  catch (err) {
    if (err.name === "TokenExpiredError") {
    return res.status(401).json({ msg: "Token expired" });
  }
    return res.status(403).json({ msg: "Invalid token" });
  }
};
