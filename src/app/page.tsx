'use client'; // This makes the file a client-side component

import { useState } from 'react';
import ChatComponent from './components/ChatComponent';

const HomePage = () => {
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
    <div className="container mx-auto px-4">
      <h1 className="text-center text-3xl font-bold mt-10">
        Welcome to SESMag Review Generator
      </h1>
      <ChatComponent history={chatHistory} onSendMessage={handleChat} />
    </div>
  );
};

export default HomePage;
