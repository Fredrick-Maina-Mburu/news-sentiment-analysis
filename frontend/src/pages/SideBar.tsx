import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircle, Trash2, LayoutDashboard } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:block w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-16">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">User Settings</h2>
        
        <div className="space-y-2">
          {/* Dashboard Button */}
          <Link
            to="/subscriptions"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive('/subscriptions')
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          {/* User Profile Button */}
          <Link
            to="/profile"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive('/profile')
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <UserCircle size={20} />
            <span>User Profile</span>
          </Link>

          {/* Delete Account Button */}
          <Link
            to="/delete-account"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive('/delete-account')
                ? 'bg-red-500 text-white'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <Trash2 size={20} />
            <span>Delete Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;