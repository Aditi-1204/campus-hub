const express = require('express');
const router = express.Router();
const Club = require('../models/Club');

// GET /api/clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find().sort({ name: 1 });
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/clubs/:id
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('members', 'name email');
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/clubs
router.post('/', async (req, res) => {
  try {
    const club = await Club.create(req.body);
    res.status(201).json(club);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/clubs/:id/join
router.post('/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    if (!club.members.includes(userId)) {
      club.members.push(userId);
      await club.save();
    }
    res.json({ message: 'Joined club', memberCount: club.members.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
