const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../database/database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters',
    });
  }

  const existingUser = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(email);

  if (existingUser) {
    return res.status(409).json({
      message: 'Email is already registered',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = db
    .prepare(`
      INSERT INTO users (email, password)
      VALUES (?, ?)
    `)
    .run(email, hashedPassword);

  const token = jwt.sign(
    {
      id: result.lastInsertRowid,
      email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: 'Account created successfully',
    user: {
      id: result.lastInsertRowid,
      email,
    },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
    });
  }

  const user = db
    .prepare(`
      SELECT id, email, password
      FROM users
      WHERE email = ?
    `)
    .get(email);

  if (!user) {
    return res.status(401).json({
      message: 'Invalid email or password',
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({
      message: 'Invalid email or password',
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });

  res.json({
    message: 'Logout successful',
  });
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

module.exports = router;