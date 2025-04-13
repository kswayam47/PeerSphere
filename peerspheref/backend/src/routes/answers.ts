import express from 'express';
import { protect } from '../middleware/auth';
import Answer from '../models/Answer';
import Question from '../models/Question';
import User from '../models/User';

const router = express.Router();

// Create an answer
router.post('/', protect, async (req: any, res) => {
  try {
    const { content, questionId } = req.body;
    const answer = await Answer.create({
      content,
      author: req.user._id,
      question: questionId
    });

    // Update question's answers array
    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answer._id }
    });

    // Update user's answersGiven count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { answersGiven: 1 }
    });

    res.status(201).json(answer);
  } catch (error) {
    res.status(400).json({ message: 'Error creating answer' });
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

    answer.upvotes += 1;
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

    answer.downvotes += 1;
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
      .populate('question', 'author');
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if the user is the question author
    if (answer.question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this answer' });
    }

    answer.isAccepted = true;
    await answer.save();

    // Update answer author's reputation
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: 15 }
    });

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Error accepting answer' });
  }
});

export default router; 