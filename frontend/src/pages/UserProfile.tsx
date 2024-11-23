import React, { useState, useEffect } from 'react';
import { UserApi } from "../services/api";
import { UserDetails } from "../types";
import { useAuth } from '../AuthContext';

const UserProfile: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, logout, username } = useAuth();
  const [userData, setUserData] = useState<UserDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await UserApi.getUserDetails(); 
      setUserData(response);
      setIsLoading(false);
    } catch (error) {
      setError('Error fetching user data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const uniqueIndustries = userData.length > 0 
    ? [...new Set(userData.map(res => res.industry))]
    : [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : userData.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">User Details</h2>
          <p className="mb-2">
            Username: <span className="font-bold">{userData[0].name}</span>
          </p>
          <p className="mb-2">
            Email: <span className="font-bold">{userData[0].email}</span>
          </p>
          <h2 className="text-xl font-bold mt-4 mb-2">Subscriptions</h2>
          <ul className="list-disc list-inside">
            {uniqueIndustries.map((industry, index) => (
              <li key={index} className="mb-1">{industry}</li>
            ))}
          </ul>
          <p className="mb-2">
            Account created at: <span className="font-bold">{userData[0].created_at.toLocaleString()}</span>
          </p>
        </div>
      ) : (
        <p>No user data found</p>
      )}
    </div>
  );
};

export default UserProfile;