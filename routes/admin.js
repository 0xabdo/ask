const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Question = require('../models/Question');
const { sendAnswerNotification } = require('../emailService');
const { validateAdminLogin } = require('../middleware/security');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin login with validation
router.post('/login',
  validateAdminLogin,
  async (req, res) => {
    try {
      const { name, accessCode } = req.body;

      // Find admin by name and access code
      const admin = await Admin.findOne({ name: name.trim(), accessCode });
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token with shorter expiration for security
      const token = jwt.sign(
        { id: admin._id, name: admin.name },
        process.env.JWT_SECRET,
        { expiresIn: '8h' } // Reduced from 24h to 8h
      );

      res.json({
        message: 'Login successful',
        token,
        admin: {
          id: admin._id,
          name: admin.name
        }
      });

    } catch (error) {
      console.error('Error during admin login:', error);
      res.status(500).json({ error: 'Error during login' });
    }
  }
);

// Get all questions (protected route)
router.get('/questions', authenticateToken, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Answer a question (protected route)
router.put('/questions/:id/answer', authenticateToken, async (req, res) => {
  try {
    const { adminResponse } = req.body;
    const questionId = req.params.id;

    if (!adminResponse) {
      return res.status(400).json({ message: 'Admin response is required' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.adminResponse = adminResponse;
    question.isAnswered = true;
    question.answeredAt = new Date();

    await question.save();

    // Send email notification to user
    try {
      const questionDate = question.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const answerDate = question.answeredAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const emailResult = await sendAnswerNotification(
        question.name,
        question.email,
        question.question,
        adminResponse,
        questionDate,
        answerDate
      );

      if (emailResult.success) {
        console.log('Email notification sent successfully to:', question.email);
      } else {
        console.error('Failed to send email notification:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      message: 'Question answered successfully',
      question
    });

  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ message: 'Error answering question' });
  }
});

// Get dashboard stats (protected route)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const answeredQuestions = await Question.countDocuments({ isAnswered: true });
    const pendingQuestions = totalQuestions - answeredQuestions;
    const answerRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    res.json({
      totalQuestions,
      answeredQuestions,
      pendingQuestions,
      answerRate
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Create initial admin (for setup - remove in production)
router.post('/setup', async (req, res) => {
  try {
    const { name, accessCode } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin
    const admin = new Admin({
      name,
      accessCode
    });

    await admin.save();

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin' });
  }
});

module.exports = router;

