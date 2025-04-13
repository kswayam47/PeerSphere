import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Menu, X, Bell, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">PeerSphere</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                className="w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-3 top-2.5 text-gray-500">
                <Search size={18} />
              </button>
            </div>
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/leaderboard" className="px-3 py-2 text-gray-700 hover:text-blue-600">Leaderboard</Link>
            {user ? (
              <>
                <Link to="/ask" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Ask Question</Link>
                <div className="relative">
                  <button 
                    className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="h-8 w-8 rounded-full" />
                    ) : (
                      <User size={24} />
                    )}
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link 
                        to={`/profile/${user.id}`} 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={() => {
                          handleSignOut();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
                <button className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-gray-100">
                  <Bell size={24} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-3 top-2.5 text-gray-500">
                <Search size={18} />
              </button>
            </div>
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/leaderboard" className="block py-2 text-gray-700 hover:text-blue-600">Leaderboard</Link>
            {user ? (
              <>
                <Link to="/ask" className="block py-2 text-gray-700 hover:text-blue-600">Ask Question</Link>
                <Link to={`/profile/${user.id}`} className="block py-2 text-gray-700 hover:text-blue-600">Profile</Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center py-2 text-gray-700 hover:text-blue-600"
                >
                  <LogOut size={18} className="mr-2" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/register" className="block py-2 text-gray-700 hover:text-blue-600">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;