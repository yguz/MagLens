'use client';  // This makes the file a client-side component

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ChatBox from './components/ChatBox';

const Home = () => {
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const handleChat = async (userInput: string) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    });
    const data = await res.json();
    setChatHistory(prev => [...prev, { user: userInput, bot: data.response }]);
  };

  return (
    <div className="container">
      <h1>SES Mag - Review by Fee</h1>
      <FileUpload onUpload={(fileData) => handleChat(fileData)} />
      <ChatBox history={chatHistory} />
    </div>
  );
};

export default Home;
