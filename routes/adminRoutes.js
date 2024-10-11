const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Admin Registration
router.post('/register', [
  body('username').isString().notEmpty(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({ username, password: hashedPassword, role: 'Admin' });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await User.findOne({ username, role: 'Admin' });
  if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

// Get Assignments for Admin
router.get('/assignments', authMiddleware('Admin'), async (req, res) => {
  try {
    const assignments = await Assignment.find({ admin: req.user.username });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept Assignment
router.post('/assignments/:id/accept', authMiddleware('Admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await Assignment.findByIdAndUpdate(id, { status: 'Accepted' });
    res.status(200).json({ message: 'Assignment accepted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject Assignment
router.post('/assignments/:id/reject', authMiddleware('Admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await Assignment.findByIdAndUpdate(id, { status: 'Rejected' });
    res.status(200).json({ message: 'Assignment rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
