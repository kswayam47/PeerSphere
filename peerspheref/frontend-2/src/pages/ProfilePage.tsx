import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface UserProfile {
  username: string;
  email: string;
  joinDate: string;
  questionsAsked: number;
  answersGiven: number;
  upvotesReceived: number;
  downvotesReceived: number;
}

const ProfilePage = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?._id || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:5000/api/users/${user._id}/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.errors) {
          throw new Error(response.data.errors[0]);
        }

        setProfile({
          username: user.username,
          email: user.email,
          joinDate: new Date(user.createdAt).toLocaleDateString(),
          questionsAsked: response.data.questionsAsked,
          answersGiven: response.data.answersGiven,
          upvotesReceived: response.data.upvotesReceived,
          downvotesReceived: response.data.downvotesReceived
        });
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        if (err.response?.data?.errors) {
          setError(err.response.data.errors[0]);
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError('Failed to load user profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, token]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <p className="text-center text-gray-600 dark:text-gray-300">Please log in to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <div className="text-red-600 dark:text-red-400 text-center">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-600 dark:text-gray-200">
                {profile?.username[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{profile?.username}</h1>
              <p className="text-gray-600 dark:text-gray-300">{profile?.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Joined: {profile?.joinDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">Questions Asked</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profile?.questionsAsked}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">Answers Given</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{profile?.answersGiven}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">Upvotes Received</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{profile?.upvotesReceived}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">Downvotes Received</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{profile?.downvotesReceived}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
