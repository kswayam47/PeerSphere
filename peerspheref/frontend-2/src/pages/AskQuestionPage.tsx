import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AskQuestionPage = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement question submission
    console.log('Submitting question:', question);
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Ask a Question</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-blue-50 dark:bg-opacity-10 p-6 rounded-lg shadow transition-colors duration-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Title
          </label>
          <input
            type="text"
            value={question.title}
            onChange={(e) => setQuestion({ ...question, title: e.target.value })}
            className="w-full p-3 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="What's your programming question?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Details
          </label>
          <textarea
            value={question.content}
            onChange={(e) => setQuestion({ ...question, content: e.target.value })}
            rows={8}
            className="w-full p-3 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Provide more details about your question..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Tags
          </label>
          <input
            type="text"
            value={question.tags}
            onChange={(e) => setQuestion({ ...question, tags: e.target.value })}
            className="w-full p-3 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Add tags (separated by commas)"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
        >
          Post Question
        </button>
      </form>
    </div>
  );
};

export default AskQuestionPage;
