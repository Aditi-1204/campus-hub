const router = require('express').Router();
const User = require('../models/User');
const Message = require('../models/Message');
const { auth, requireRole } = require('../middleware/auth');

// All routes here require: valid JWT + role must be 'admin'
// auth      → verifies token, attaches req.user = { id, role }
// requireRole('admin') → returns 403 if role !== 'admin'

// GET /api/admin/users — get all registered users
router.get('/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/users/:id — delete a user
router.delete('/users/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/admin/users/:id/role — change a user's role
router.patch('/users/:id/role', auth, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const allowed = ['student', 'faculty', 'admin'];
    if (!allowed.includes(role))
      return res.status(400).json({ success: false, message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: `Role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/messages — view all messages across the system
router.get('/messages', auth, requireRole('admin'), async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
