import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ConversationList from './ConversationList';
import UserProfile from './UserProfile';
import Conversation from './Conversation';

function Dashboard() {
  const { id } = useParams(); // Extract the active conversation name from the URL
 // const [selectedConversationName, setSelectedConversationName] = useState('');

  const checkUserName = () => {
    return localStorage.getItem('username');
  }

  useEffect(() => {
    const isLoggedIn = checkUserName();
    if (!isLoggedIn) {
      window.location.href = "/";
    }
  }, []);



  return (
    <div className="flex flex-row h-screen">
      <div className="w-1/3 p-4 bg-gray-200">
        <UserProfile />
        <ConversationList onSelectConversation={id } />
      </div>
      <div className="w-2/3 p-4 bg-gray-100">
        <p className="text-center text-xl font-semibold">Select a conversation</p>
        {id && <Conversation conversationName={id } /> }
        
      </div>
    </div>
  );
}

export default Dashboard;
