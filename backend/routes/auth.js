const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ─── Helpers ────────────────────────────────────────────────────────────────

const genToken = (id, role) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined in environment variables');
  return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
};

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// ─── Input Validators ────────────────────────────────────────────────────────

const validateRegisterInput = ({ name, email, password: plainPassword }) => {
  if (!name || !email || !plainPassword)
    return 'Name, email and password are required';
  if (typeof name !== 'string' || name.trim().length < 2)
    return 'Name must be at least 2 characters';
  if (typeof email !== 'string' || !email.includes('@'))
    return 'Invalid email address';
  if (typeof plainPassword !== 'string' || plainPassword.length < 6)
    return 'Password must be at least 6 characters';
  return null;
};

const validateLoginInput = ({ email, password: plainPassword }) => {
  if (!email || !plainPassword)
    return 'Email and password are required';
  if (typeof email !== 'string' || !email.includes('@'))
    return 'Invalid email address';
  if (typeof plainPassword !== 'string' || plainPassword.length < 1)
    return 'Password cannot be empty';
  return null;
};

// ─── POST /api/auth/register ─────────────────────────────────────────────────

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    const validationError = validateRegisterInput({ name, email, password });
    if (validationError)
      return res.status(400).json({ success: false, message: validationError });

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
      return res.status(409).json({ success: false, message: 'Email is already registered' });

    const allowedRoles = ['student', 'faculty', 'admin'];
    const assignedRole = allowedRoles.includes(role) ? role : 'student';

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: assignedRole,
    });

    const token = genToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: safeUser(user),
    });
  } catch (err) {
    console.error('[REGISTER ERROR]', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  try {
    console.log('[LOGIN] raw req.body:', JSON.stringify(req.body));
    console.log('[LOGIN] Content-Type:', req.headers['content-type']);
    const { email, password } = req.body || {};

    // 1. Validate input
    const validationError = validateLoginInput({ email, password });
    if (validationError) {
      console.log('[LOGIN] Validation failed:', validationError);
      return res.status(400).json({ success: false, message: validationError });
    }

    // 2. Check DB connection state (0=disconnected,1=connected,2=connecting,3=disconnecting)
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error('[LOGIN] MongoDB not connected. State:', mongoose.connection.readyState);
      return res.status(503).json({ success: false, message: 'Database unavailable. Please try again.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find user with timeout
    const user = await User.findOne({ email: normalizedEmail })
      .select('+password')
      .maxTimeMS(8000);

    console.log('[LOGIN] User found:', user ? user.email : 'NOT FOUND');

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found. Please register.' });

    // 4. Check password field exists (guard against legacy users)
    if (!user.password) {
      console.error('[LOGIN] Password field missing for user:', user.email);
      return res.status(500).json({ success: false, message: 'Account error. Please re-register.' });
    }

    // 5. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('[LOGIN] Password match:', isMatch);

    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });

    // 6. Generate token
    const token = genToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser(user),
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err.message);
    if (err.message.includes('buffering timed out') || err.message.includes('ETIMEDOUT'))
      return res.status(503).json({ success: false, message: 'Database connection timed out. Please try again.' });
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
