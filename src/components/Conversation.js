import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import io from 'socket.io-client';

function Conversation({ conversationName }) {
  const activeUser = localStorage.getItem('username');
  const activeConversationName = conversationName;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:5001', {
      auth: { token: localStorage.getItem('token') },
    });

    socket.emit('join', activeConversationName);

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5001/messages/${activeConversationName}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (activeConversationName) {
      fetchMessages();
    }

    socket.on('message', (message) => {
      if (message.conversationName === activeConversationName) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ activeConversationName]);

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const sendMessage = () => {
    const socket = io('http://localhost:5001', {
      auth: { token: localStorage.getItem('token') },
    });
    socket.emit('sendMessage', { text: messageInput, sender: activeUser, conversationName: activeConversationName });
    setMessageInput('');
  };

  const leaveConversation = async () => {
    try {
      const response = await fetch(`http://localhost:5001/leaveconversation/${activeConversationName}/${activeUser}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include authentication token if needed
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.ok) {
        console.log('Left conversation successfully');
        window.location.href = '/dashboard';
      } else {
        console.error('Failed to leave conversation');
      }
    } catch (error) {
      console.error('Error leaving conversation:', error);
    }
  };
  

  return (
    <div className="w-full mt-10">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="text-lg font-semibold">Messages</p>
        <div className="p-4 bg-gray-100 h-64 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${message.sender === activeUser ? 'items-end' : 'items-start'}`}
            >
              <p className={`bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs mb-1 ${message.sender === activeUser ? 'ml-auto' : 'mr-auto'}`}>
                {message.text}
              </p>
              <p className={`text-xs ${message.sender === activeUser ? 'text-right' : 'text-left'}`}>
                {message.sender === activeUser ? 'You' : message.sender}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="text-lg font-semibold">New Message</p>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
          placeholder="Type your message here"
          value={messageInput}
          onChange={handleMessageInputChange}
        ></textarea>
        <div className="mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={leaveConversation}
        >
          Leave Conversation <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
}

export default Conversation;
