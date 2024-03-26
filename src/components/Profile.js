import React, { useState, useEffect } from "react";
import axios from "axios";

function EditProfile() {
  const [editProfile, setEditProfile] = useState(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchEditProfile = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await axios.get(
          `https://chatapp.review24info.online/userProfile/${username}`
        );

        if (response && response.data) {
          const { fullName, email, username } = response.data;
          setName(fullName);
          setEmail(email);
          setUsername(username);
          setEditProfile(response.data);
        } else {
          setError("Failed to fetch user profile");
        }
      } catch (error) {
        setError("Error fetching user profile: " + error.message);
      }
    };

    fetchEditProfile();
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSave = async () => {
    try {
      const updatedProfile = {
        fullName: name,
        email: email,
        username: username,
        password: password
      };
      const response = await axios.put(
        `https://chatapp.review24info.online/updateProfile/${username}`,
        updatedProfile
      );
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      setError("Error updating user profile: " + error.message);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-10">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <p className="text-lg font-semibold">User Profile</p>
          {error && <p className="text-red-500">{error}</p>}
          {editProfile && (
            <div>
              <p>Name:</p>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={name}
                onChange={handleNameChange}
              />
              <p>Email:</p>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              <p>Username:</p>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={username}
                onChange={handleUsernameChange}
              />
              <p>Password:</p>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="*********"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
