import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await axios.get(`http://localhost:5001/userProfile/${username}`); 
        
        if (response && response.data) {
          setUserProfile(response.data); // Set user profile data in state
        } else {
          setError('Failed to fetch user profile');
        }
      } catch (error) {
        setError('Error fetching user profile: ' + error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    return window.location.href = '/profile';
  }

  return (
    <div className="mb-4">
      <p className="text-lg font-semibold">User Profile</p>
      {error && <p className="text-red-500">{error}</p>}
      {userProfile && (
        <div className="p-4 bg-white shadow-md">
          <p>Name: {userProfile.fullName}</p>
          <p>Email: {userProfile.email}</p>
          <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleEdit}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
