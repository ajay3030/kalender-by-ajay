// backend/middleware/auth.js
const { verifyToken } = require('../utils/jwt');

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
      return res.status(401).json({ msg: 'No token provided' });

    const decoded = verifyToken(auth.split(' ')[1]);
    req.user = decoded;          // { id: ..., iat: ..., exp: ... }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalid or expired' });
  }
};

/* Optional auth: attaches user if token valid, continues anyway */
const optional = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      const decoded = verifyToken(auth.split(' ')[1]);
      req.user = decoded;
    }
  } catch { /* ignore */ }
  next();
};

module.exports = { protect, optional };