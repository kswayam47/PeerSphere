import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuestionCard from './QuestionCard';
import AnswerCard from './AnswerCard';

interface UserProfileProps {
  currentUserId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ currentUserId }) => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUser(response.data.user);
        setQuestions(response.data.questions);
        setAnswers(response.data.answers);
        setIsFollowing(response.data.user.followers.includes(currentUserId));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, currentUserId]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.post(`/api/users/${id}/unfollow`);
      } else {
        await axios.post(`/api/users/${id}/follow`);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
            <div className="mt-2 flex space-x-4">
              <span className="text-gray-600">
                {user.questionsAsked} questions
              </span>
              <span className="text-gray-600">
                {user.answersGiven} answers
              </span>
              <span className="text-gray-600">
                {user.followers.length} followers
              </span>
              <span className="text-gray-600">
                {user.following.length} following
              </span>
            </div>
          </div>
          {currentUserId && currentUserId !== id && (
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-md ${
                isFollowing
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Questions</h2>
          {questions.length === 0 ? (
            <p className="text-gray-600">No questions yet</p>
          ) : (
            questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Answers</h2>
          {answers.length === 0 ? (
            <p className="text-gray-600">No answers yet</p>
          ) : (
            answers.map((answer) => (
              <AnswerCard
                key={answer._id}
                answer={answer}
                onUpvote={() => {}}
                onDownvote={() => {}}
                onAccept={() => {}}
                isQuestionAuthor={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 