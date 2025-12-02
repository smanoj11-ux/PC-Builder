import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import PCBuilder from './components/PCBuilder';

function App() {
  const [view, setView] = useState<'chat' | 'builder'>('chat');
  const [initialPrompt, setInitialPrompt] = useState('');

  const handleStartBuilder = (prompt: string) => {
    setInitialPrompt(prompt);
    // Simulate the "Thinking" delay and transition
    setTimeout(() => {
        setView('builder');
    }, 1000);
  };

  return (
    <div className="antialiased text-slate-200 bg-black min-h-screen">
      {view === 'chat' ? (
        <ChatInterface onStartBuilder={handleStartBuilder} />
      ) : (
        <div className="animate-fade-in">
           <PCBuilder />
        </div>
      )}
    </div>
  );
}

export default App;
