import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';

function ConversationList({ onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const [newConversationName, setNewConversationName] = useState('');
  const [joinConversationName, setJoinConversationName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchConversations = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await axios.get(`https://stunneagle-chat-2477de19fb41.herokuapp.com/loadconversations/${username}`);
      if (response.status === 200) {
        setConversations(response.data.conversations);
      } else {
        console.error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await axios.post('http://localhost:5001/createconversation', {
        name: newConversationName,
        participants: [localStorage.getItem('username')]
      });
  
      if (response.status === 201) {
        setConversations(prevConversations => [...prevConversations, newConversationName]);
        setNewConversationName('');
      } else {
        setErrorMessage('Failed to create conversation');
      }
    } catch (error) {
      setErrorMessage(`Error creating conversation: ${error.response.data.message}`);
    }
  };

  const handleJoin = async () => {
    try {
      const response = await axios.post('https://stunneagle-chat-2477de19fb41.herokuapp.com/joinconversation', {
        conversationName: joinConversationName,
        username: localStorage.getItem('username')
      });
  
      if (response.status === 200) {
        setConversations(prevConversations => [...prevConversations, joinConversationName]);
        setJoinConversationName('');
      } else {
        setErrorMessage('Failed to join conversation');
      }
    } catch (error) {
      setErrorMessage(`Error joining conversation: ${error.response.data.message}`);
    }
  };
  
  const handleDelete = async (conversationName) => {
    try {
      const response = await axios.delete(`http://localhost:5001/deleteconversation/${conversationName}`);
  
      if (response.status === 200) {
        setConversations(prevConversations => prevConversations.filter(conv => conv !== conversationName));
      } else {
        setErrorMessage('Failed to delete conversation');
      }
    } catch (error) {
      setErrorMessage(`Error deleting conversation: ${error.response.data.message}`);
    }
  };

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  return (
    <div>
      <p className="text-lg font-semibold mb-2">Conversations</p>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={(e) => e.preventDefault()} className="mb-2">
        <input
          type="text"
          value={newConversationName}
          onChange={(e) => handleInputChange(e, setNewConversationName)}
          placeholder="Create new conversation"
          className="mr-2 p-2 border rounded focus:outline-none focus:shadow-outline"
        />
        <button type="button" onClick={handleCreate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Create
        </button>
      </form>
      <form onSubmit={(e) => { e.preventDefault(); handleJoin(); }} className="mb-2">
        <input
          type="text"
          value={joinConversationName}
          onChange={(e) => handleInputChange(e, setJoinConversationName)}
          placeholder="Join a conversation"
          className="mr-2 p-2 border rounded focus:outline-none focus:shadow-outline"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Join
        </button>
      </form>
      <ul className="mt-2">
        {conversations.map(conversationName => (
          <li key={conversationName} className="p-2 bg-white shadow-md mb-2 flex justify-between items-center">
            <Link
              to={`/dashboard/${conversationName}`}
              className={`text-blue-500 hover:underline ${conversationName === onSelectConversation ? 'font-bold' : ''}`}
            >
              {conversationName}
            </Link>
            <button onClick={() => handleDelete(conversationName)}>
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConversationList;
