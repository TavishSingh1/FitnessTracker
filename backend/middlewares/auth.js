import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export default function auth (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    req.user = jwt.verify(token, JWT_SECRET).user;
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};