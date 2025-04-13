import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController';
import { protect } from '../middleware/auth';
import User from '../models/User';
import Question from '../models/Question';
import Answer from '../models/Answer';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // First check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        errors: ['The requested user does not exist']
      });
    }
    
    // Get user's questions and answers
    const [questions, answers] = await Promise.all([
      Question.find({ author: userId }),
      Answer.find({ author: userId })
    ]);

    // Calculate upvotes and downvotes from both questions and answers
    let questionUpvotes = 0;
    let questionDownvotes = 0;
    let answerUpvotes = 0;
    let answerDownvotes = 0;

    try {
      questionUpvotes = questions.reduce((sum, question) => {
        return sum + (Array.isArray(question.upvotes) ? question.upvotes.length : 0);
      }, 0);

      questionDownvotes = questions.reduce((sum, question) => {
        return sum + (Array.isArray(question.downvotes) ? question.downvotes.length : 0);
      }, 0);

      answerUpvotes = answers.reduce((sum, answer) => {
        return sum + (Array.isArray(answer.upvotes) ? answer.upvotes.length : 0);
      }, 0);

      answerDownvotes = answers.reduce((sum, answer) => {
        return sum + (Array.isArray(answer.downvotes) ? answer.downvotes.length : 0);
      }, 0);
    } catch (error) {
      console.error('Error calculating votes:', error);
      // If there's an error calculating votes, set them to 0
      questionUpvotes = 0;
      questionDownvotes = 0;
      answerUpvotes = 0;
      answerDownvotes = 0;
    }

    const totalUpvotes = questionUpvotes + answerUpvotes;
    const totalDownvotes = questionDownvotes + answerDownvotes;

    res.json({
      questionsAsked: questions.length,
      answersGiven: answers.length,
      upvotesReceived: totalUpvotes,
      downvotesReceived: totalDownvotes
    });
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid user ID',
        errors: ['The provided user ID is not valid']
      });
    }
    res.status(500).json({ 
      message: 'Error fetching user statistics',
      errors: ['An unexpected error occurred while fetching user statistics']
    });
  }
});

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username')
      .populate('following', 'username');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's questions and answers
    const [questions, answers] = await Promise.all([
      Question.find({ author: user._id }).sort({ createdAt: -1 }),
      Answer.find({ author: user._id }).sort({ createdAt: -1 })
    ]);

    res.json({
      user,
      questions,
      answers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Follow a user
router.post('/:id/follow', protect, async (req: any, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    if (userToFollow.followers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Update both users
    await Promise.all([
      User.findByIdAndUpdate(req.user._id, {
        $push: { following: userToFollow._id }
      }),
      User.findByIdAndUpdate(userToFollow._id, {
        $push: { followers: req.user._id }
      })
    ]);

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).json({ message: 'Error following user' });
  }
});

// Unfollow a user
router.post('/:id/unfollow', protect, async (req: any, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update both users
    await Promise.all([
      User.findByIdAndUpdate(req.user._id, {
        $pull: { following: userToUnfollow._id }
      }),
      User.findByIdAndUpdate(userToUnfollow._id, {
        $pull: { followers: req.user._id }
      })
    ]);

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('username questionsAsked answersGiven reputation')
      .sort({ reputation: -1, questionsAsked: -1, answersGiven: -1 })
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

export default router; 