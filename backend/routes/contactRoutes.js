const express = require('express');
const Contact = require('../models/Contact');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const contact = await Contact.create({ name, email, phone, subject, message });

    res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', protect, admin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/read', protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
