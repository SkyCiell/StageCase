const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body } = require('express-validator');
const { User } = require('../models');
const { success, error } = require('../helpers/response');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/email');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return error(res, 'Email already registered', 409);

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user.id, user.role);

    try { await sendWelcomeEmail(user); } catch (_) {}

    return success(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return error(res, 'Invalid credentials', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return error(res, 'Invalid credentials', 401);

    const token = generateToken(user.id, user.role);
    return success(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone },
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return success(res, null, 'If the email exists, a reset link has been sent.');

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.update({ reset_token: token, reset_token_expires: expires });
    try { await sendPasswordResetEmail(user, token); } catch (_) {}

    return success(res, null, 'Password reset email sent.');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ where: { reset_token: token } });
    if (!user || new Date() > user.reset_token_expires) {
      return error(res, 'Invalid or expired reset token', 400);
    }
    await user.update({ password, reset_token: null, reset_token_expires: null });
    return success(res, null, 'Password reset successful. Please log in.');
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  return success(res, req.user, 'Profile fetched');
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { register, login, forgotPassword, resetPassword, me, registerValidation, loginValidation };
