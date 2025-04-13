import { useState } from 'react';

interface LeaderboardUser {
  id: number;
  username: string;
  score: number;
  questionsCount: number;
  answersCount: number;
}

const LeaderboardPage = () => {
  const [users] = useState<LeaderboardUser[]>([
    { id: 1, username: 'JohnDoe', score: 1250, questionsCount: 15, answersCount: 25 },
    { id: 2, username: 'JaneSmith', score: 980, questionsCount: 10, answersCount: 20 },
    { id: 3, username: 'BobWilson', score: 750, questionsCount: 8, answersCount: 15 },
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-bold">{user.score}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.questionsCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.answersCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
