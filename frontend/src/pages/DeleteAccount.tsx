import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { UserApi } from '../services/api';

const DeleteAccount: React.FC = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleDeleteAccount = async () => {
      try {
       const response = await UserApi.deleteUserAccount();
        
        setIsLoggedIn(false);
        localStorage.removeItem('token');

        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
      }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Delete Account</h1>
      <div className="max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl text-red-600 font-semibold mb-4">
          Delete Your Account
        </h2>
        <p className="mb-6 text-gray-600">
          Warning: This action is permanent and cannot be undone. All your data
          will be permanently deleted.
        </p>
        <button
          onClick={()=> handleDeleteAccount()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;