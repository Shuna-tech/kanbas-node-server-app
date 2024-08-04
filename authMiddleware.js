import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // 确保只获取令牌部分
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Failed to authenticate token", err);
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.user = decoded;
    console.log("Token authenticated", decoded);
    next();
  });
};

export default authenticateUser;
