const jwt = require('jsonwebtoken');

// ─── Verify JWT token ────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check header exists and has correct format
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });

  const token = authHeader.split(' ')[1];

  // 2. Check JWT_SECRET is configured
  const secret = process.env.JWT_SECRET;
  if (!secret)
    return res.status(500).json({ success: false, message: 'Server configuration error.' });

  // 3. Verify token
  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
  }
};

// ─── Role-based guard (use after auth) ───────────────────────────────────────
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  if (!roles.includes(req.user.role))
    return res.status(403).json({ success: false, message: `Access denied. Requires role: ${roles.join(' or ')}.` });
  next();
};

module.exports = { auth, requireRole };
