import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const token = auth.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
