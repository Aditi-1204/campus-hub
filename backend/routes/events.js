const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /api/events?date=YYYY-MM-DD&club=clubId
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.club) filter.club = req.query.club;
    if (req.query.date) {
      const start = new Date(req.query.date);
      const end = new Date(req.query.date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }
    const events = await Event.find(filter).populate('club', 'name').sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('club', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events
router.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/events/:id/rsvp
router.post('/:id/rsvp', async (req, res) => {
  try {
    const { userId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.rsvps.includes(userId)) {
      event.rsvps.push(userId);
      await event.save();
    }
    res.json({ message: 'RSVP successful', rsvpCount: event.rsvps.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
