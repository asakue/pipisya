import { useState } from 'react';
import LoginScreen from '@/components/LoginScreen';
import ChatInterface from '@/components/ChatInterface';
import { ChatProvider, useChat } from '@/contexts/ChatContext';

function HomeContent() {
  const { currentUser, joinChat } = useChat();

  if (!currentUser) {
    return <LoginScreen onJoin={joinChat} />;
  }

  return <ChatInterface />;
}

export default function Home() {
  return (
    <ChatProvider>
      <HomeContent />
    </ChatProvider>
  );
}
