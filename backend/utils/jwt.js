// backend/utils/jwt.js
const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

/* Generate tokens */
const generateToken = (userId) =>
  jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: '24h' });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });

/* Verify */
const verifyToken = (token) => jwt.verify(token, ACCESS_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken
};