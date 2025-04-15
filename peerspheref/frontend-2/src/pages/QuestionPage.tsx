import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Answer {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

interface Question {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
  answers: Answer[];
}

const QuestionPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/questions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setQuestion(response.data);
      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load question. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id, token]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) {
      setError('Answer cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newAnswer,
          questionId: id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setError(data.errors.join(', '));
        } else {
          setError(data.message || 'Failed to post answer');
        }
        return;
      }

      // Update the answers state with the new answer
      setQuestion(prev => {
        if (!prev) return null;
        return {
          ...prev,
          answers: [data, ...prev.answers]
        };
      });

      // Clear the form
      setNewAnswer('');
      setError('');
    } catch (err) {
      setError('Failed to post answer. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          Question not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
        <p className="text-gray-700 mb-4">{question.content}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>Asked by {question.author.username}</span>
          <span className="mx-2">•</span>
          <span>{new Date(question.createdAt).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{question.upvotes - question.downvotes} votes</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{question.answers.length} Answers</h2>
        {question.answers.length === 0 ? (
          <p className="text-gray-600">No answers yet. Be the first to answer!</p>
        ) : (
          question.answers.map((answer) => (
            <div key={answer._id} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <p className="text-gray-700 mb-4">{answer.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>Answered by {answer.author.username}</span>
                <span className="mx-2">•</span>
                <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{answer.upvotes - answer.downvotes} votes</span>
              </div>
            </div>
          ))
        )}
      </div>

      {user && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your Answer</h2>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              className="w-full p-3 border rounded-md mb-4"
              rows={6}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Post Answer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
