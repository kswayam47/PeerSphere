import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface UserStats {
  questionsAsked: number;
  answersGiven: number;
  upvotesReceived: number;
  downvotesReceived: number;
}

const Profile: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    questionsAsked: 0,
    answersGiven: 0,
    upvotesReceived: 0,
    downvotesReceived: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?._id || !token) return;

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/users/${user._id}/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError('Failed to load user statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user?._id, token]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          Please log in to view your profile
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Username:</span> {user.username}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Questions Asked:</span> {stats.questionsAsked}</p>
              <p><span className="font-semibold">Answers Given:</span> {stats.answersGiven}</p>
              <p><span className="font-semibold">Upvotes Received:</span> {stats.upvotesReceived}</p>
              <p><span className="font-semibold">Downvotes Received:</span> {stats.downvotesReceived}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 