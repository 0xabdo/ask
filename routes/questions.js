const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { validateQuestionSubmission } = require('../middleware/security');

// Submit a new question with validation
router.post('/', 
  validateQuestionSubmission,
  async (req, res) => {
    try {
      const { name, email, question } = req.body;

      // Additional server-side validation
      if (!name || !email || !question) {
        return res.status(400).json({ 
          error: 'Name, email, and question are required'
        });
      }

      // Check for duplicate submissions from same email in last hour
      const recentSubmission = await Question.findOne({
        email: email,
        createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
      });

      if (recentSubmission) {
        return res.status(429).json({ 
          error: 'You have already submitted a question recently. Please wait before submitting another.'
        });
      }

      // Create new question
      const newQuestion = new Question({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        question: question.trim(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      await newQuestion.save();

      res.status(201).json({ 
        message: 'Question submitted successfully!',
        questionId: newQuestion._id
      });

    } catch (error) {
      console.error('Error submitting question:', error);
      res.status(500).json({ 
        error: 'Error submitting question'
      });
    }
  }
);

// Get all questions (for admin use)
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Get question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

module.exports = router;

