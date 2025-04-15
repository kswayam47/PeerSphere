import express from 'express';
import { protect } from '../middleware/auth';
import Question from '../models/Question';
import User from '../models/User';

const router = express.Router();

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Create a question
router.post('/', protect, async (req: any, res) => {
  try {
    const { title, content, tags } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: ['Title and content are required']
      });
    }

    // Validate field lengths
    const errors = [];
    if (title.length < 10) {
      errors.push('Title must be at least 10 characters long');
    }
    if (content.length < 20) {
      errors.push('Content must be at least 20 characters long');
    }
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors
      });
    }

    // Create the question
    const question = await Question.create({
      title,
      content,
      tags: tags || [],
      author: req.user._id,
      upvotes: [],
      downvotes: []
    });

    // Update user's questionsAsked count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { questionsAsked: 1 }
    });

    // Populate the author field before sending the response
    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'username');

    res.status(201).json(populatedQuestion);
  } catch (error: any) {
    console.error('Error creating question:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    res.status(500).json({ message: 'Error creating question' });
  }
});

// Get a specific question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'answers',
        populate: [
          {
            path: 'author',
            select: 'username'
          },
          {
            path: 'comments.author',
            select: 'username'
          }
        ]
      });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// Upvote a question
router.post('/:id/upvote', protect, async (req: any, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user already upvoted
    if (question.upvotes.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already upvoted this question' });
    }

    // Remove from downvotes if exists
    question.downvotes = question.downvotes.filter(id => id.toString() !== req.user._id.toString());
    
    // Add to upvotes
    question.upvotes.push(req.user._id);
    await question.save();

    // Update author's reputation
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: 5 }
    });

    res.json(question);
  } catch (error) {
    console.error('Error upvoting question:', error);
    res.status(500).json({ message: 'Error upvoting question' });
  }
});

// Downvote a question
router.post('/:id/downvote', protect, async (req: any, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user already downvoted
    if (question.downvotes.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already downvoted this question' });
    }

    // Remove from upvotes if exists
    question.upvotes = question.upvotes.filter(id => id.toString() !== req.user._id.toString());
    
    // Add to downvotes
    question.downvotes.push(req.user._id);
    await question.save();

    // Update author's reputation
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: -2 }
    });

    res.json(question);
  } catch (error) {
    console.error('Error downvoting question:', error);
    res.status(500).json({ message: 'Error downvoting question' });
  }
});

export default router; 