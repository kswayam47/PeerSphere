import mongoose, { Document, Model } from 'mongoose';

export interface IAnswer extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  isAccepted: boolean;
}

interface IAnswerModel extends Model<IAnswer> {
  // Add any static methods here if needed
}

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
  }
}, {
  timestamps: true
});

const Answer = mongoose.model<IAnswer, IAnswerModel>('Answer', answerSchema);

export default Answer; 