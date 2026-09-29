import jwt from "jsonwebtoken";

export const protect = (role) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Authentication required"
        });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      if (role && decoded.role !== role) {
        return res.status(403).json({
          message: "Access denied"
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token"
      });
    }
  };
};