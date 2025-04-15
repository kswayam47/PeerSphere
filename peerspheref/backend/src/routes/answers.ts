import express from 'express';
import { protect } from '../middleware/auth';
import Answer from '../models/Answer';
import Question from '../models/Question';
import User from '../models/User';
import { sendNewAnswerNotification, sendAnswerAcceptedNotification } from '../utils/emailService';

const router = express.Router();

// Create an answer
router.post('/', protect, async (req: any, res) => {
  try {
    const { content, questionId } = req.body;

    // Validate required fields
    if (!content || !questionId) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: ['Content and questionId are required']
      });
    }

    // Validate content length
    if (content.length < 10) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: ['Content must be at least 10 characters long']
      });
    }

    // Check if question exists
    const question = await Question.findById(questionId)
      .populate('author');
    if (!question) {
      return res.status(404).json({ 
        message: 'Question not found'
      });
    }

    // Create the answer
    const answer = await Answer.create({
      content,
      author: req.user._id,
      question: questionId,
      upvotes: [],
      downvotes: []
    });

    // Update question's answers array
    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answer._id }
    });

    // Update user's answersGiven count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { answersGiven: 1 }
    });

    // Populate the author field before sending the response
    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username');

    // Get current user (answer author) details
    const currentUser = await User.findById(req.user._id);

    // Get question author details to send notification email
    const questionAuthor = question.author;

    // Send email notification to question author if it's not the same person as answer author
    if (questionAuthor._id.toString() !== req.user._id.toString()) {
      await sendNewAnswerNotification(
        questionAuthor.email,
        questionAuthor.username,
        question.title,
        content,
        currentUser.username,
        questionId
      );
    }

    res.status(201).json(populatedAnswer);
  } catch (error: any) {
    console.error('Error creating answer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    res.status(500).json({ message: 'Error creating answer' });
  }
});

// Get answers for a question
router.get('/question/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching answers' });
  }
});

// Upvote an answer
router.post('/:id/upvote', protect, async (req: any, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user has already upvoted
    if (answer.upvotes.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already upvoted this answer' });
    }

    // Remove from downvotes if exists
    answer.downvotes = answer.downvotes.filter(id => id.toString() !== req.user._id.toString());
    
    // Add to upvotes
    answer.upvotes.push(req.user._id);
    await answer.save();

    // Update author's reputation
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: 10 }
    });

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Error upvoting answer' });
  }
});

// Downvote an answer
router.post('/:id/downvote', protect, async (req: any, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user has already downvoted
    if (answer.downvotes.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already downvoted this answer' });
    }

    // Remove from upvotes if exists
    answer.upvotes = answer.upvotes.filter(id => id.toString() !== req.user._id.toString());
    
    // Add to downvotes
    answer.downvotes.push(req.user._id);
    await answer.save();

    // Update author's reputation
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: -2 }
    });

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Error downvoting answer' });
  }
});

// Accept an answer
router.post('/:id/accept', protect, async (req: any, res) => {
  try {
    const answer = await Answer.findById(req.params.id)
      .populate({
        path: 'question',
        populate: { path: 'author', select: 'username' }
      })
      .populate('author', 'email username');
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if the user is the question author
    if (answer.question.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this answer' });
    }

    answer.isAccepted = true;
    await answer.save();

    // Update answer author's reputation
    await User.findByIdAndUpdate(answer.author._id, {
      $inc: { reputation: 15 }
    });

    // Get the question details
    const question = await Question.findById(answer.question._id).select('title');

    // Send email notification to answer author
    if (answer.author._id.toString() !== req.user._id.toString()) {
      await sendAnswerAcceptedNotification(
        answer.author.email,
        answer.author.username,
        question.title,
        answer.question.author.username,
        answer.question._id.toString()
      );
    }

    res.json(answer);
  } catch (error) {
    console.error('Error accepting answer:', error);
    res.status(500).json({ message: 'Error accepting answer' });
  }
});

// Add a comment to an answer
router.post('/:id/comments', protect, async (req: any, res) => {
  try {
    const { content } = req.body;
    
    // Validate content
    if (!content || content.trim().length < 3) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: ['Comment must be at least 3 characters long']
      });
    }
    
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    
    // Add the comment
    answer.comments.push({
      content,
      author: req.user._id
    });
    
    await answer.save();
    
    // Get the updated answer with populated comments
    const updatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    
    res.status(201).json(updatedAnswer);
  } catch (error: any) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Get comments for an answer
router.get('/:id/comments', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id)
      .populate('comments.author', 'username');
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    
    res.json(answer.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

export default router; 