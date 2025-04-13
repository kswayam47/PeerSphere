import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface Answer {
  id: number;
  author: string;
  content: string;
  votes: number;
  createdAt: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  votes: number;
  answers: Answer[];
}

const QuestionPage = () => {
  const { id } = useParams();
  const [question] = useState<Question>({
    id: id || '1',
    title: 'How to implement authentication in React?',
    content: 'I am building a React application and need to implement user authentication. What are the best practices and recommended approaches?',
    author: 'JohnDoe',
    createdAt: '2023-12-01',
    votes: 10,
    answers: [
      {
        id: 1,
        author: 'JaneSmith',
        content: 'You can use JWT tokens with a proper authentication flow...',
        votes: 5,
        createdAt: '2023-12-02'
      }
    ]
  });

  const [newAnswer, setNewAnswer] = useState('');

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement answer submission
    console.log('Submitting answer:', newAnswer);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
        <p className="text-gray-700 mb-4">{question.content}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>Asked by {question.author}</span>
          <span className="mx-2">•</span>
          <span>{question.createdAt}</span>
          <span className="mx-2">•</span>
          <span>{question.votes} votes</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{question.answers.length} Answers</h2>
        {question.answers.map((answer) => (
          <div key={answer.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <p className="text-gray-700 mb-4">{answer.content}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Answered by {answer.author}</span>
              <span className="mx-2">•</span>
              <span>{answer.createdAt}</span>
              <span className="mx-2">•</span>
              <span>{answer.votes} votes</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Your Answer</h2>
        <form onSubmit={handleSubmitAnswer}>
          <textarea
            className="w-full p-3 border rounded-md mb-4"
            rows={6}
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer here..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Post Answer
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionPage;
