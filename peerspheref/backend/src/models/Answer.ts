import mongoose, { Document, Model } from 'mongoose';

export interface IComment {
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt?: Date;
}

export interface IAnswer extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  isAccepted: boolean;
  comments: IComment[];
}

interface IAnswerModel extends Model<IAnswer> {
  // Add any static methods here if needed
}

// Comment schema
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Comment must be at least 3 characters long']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const answerSchema = new mongoose.Schema<IAnswer, IAnswerModel>({
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    minlength: [10, 'Content must be at least 10 characters long']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isAccepted: {
    type: Boolean,
    default: false
  },
  comments: [commentSchema]
}, {
  timestamps: true
});

const Answer = mongoose.model<IAnswer, IAnswerModel>('Answer', answerSchema);

export default Answer; 