import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { CircleUserRound, Menu, X, UserCircle, Trash2, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, logout, username } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [navigate]);

  return (
    <>
      <nav className="bg-blue-500 text-white p-4 shadow-md fixed w-full z-40">
        <div className="container mx-auto flex justify-between items-center pr-4">
          {/* Hamburger Menu for Mobile */}
          {isLoggedIn && (
            <button 
              className="md:hidden"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            >
              {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          <h1 className="text-xl font-bold">
            <Link to="/">NewsApp</Link>
          </h1>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <CircleUserRound className="h-6 w-6" />
                  <span className="hidden md:inline">Welcome, {username}</span>
                </div>
                {/* {userData.map(res => res.name)} */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      User Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isLoggedIn && (
        <div 
          className={`
            fixed top-16 left-0 w-64 h-screen bg-white shadow-lg z-30 
            transform transition-transform duration-300 ease-in-out
            sm:hidden
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">User Settings</h2>
            
            <div className="space-y-2">
              <Link
                to="/subscriptions"
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <UserCircle size={20} />
                <span>User Profile</span>
              </Link>

              <Link
                to="/delete-account"
                className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <Trash2 size={20} />
                <span>Delete Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;