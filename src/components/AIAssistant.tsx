import { Send, Bell, Home, DollarSign, Calendar, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import bwmLogo from '../assets/BWM logo.png';

interface AIAssistantProps {
  onNavigate: (screen: string) => void;
}

const suggestedPrompts = [
  'When is the next event?',
  'Tell me about Rumah Penghulu',
  'How can I become a volunteer?',
  'What are the membership benefits?',
];

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
}

export function AIAssistant({ onNavigate }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI Heritage Assistant. How can I help you today? You can ask me about BWM, our campaigns, or Malaysian heritage.",
      sender: 'ai',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      const lowerText = text.toLowerCase();

      if (lowerText.includes('event') || lowerText.includes('next')) {
        aiResponse = "Our next event is the Kuala Lumpur Heritage Walk on November 25, 2025. It's a guided tour through KL's colonial architecture. Would you like to book a spot?";
      } else if (lowerText.includes('rumah penghulu')) {
        aiResponse = "Rumah Penghulu is a beautiful traditional Malay house that we're currently restoring. We've raised RM15,000 of our RM20,000 goal. Every donation helps preserve this piece of Malaysian heritage!";
      } else if (lowerText.includes('volunteer')) {
        aiResponse = "That's wonderful! Volunteers are the heart of BWM. You can register as a volunteer through any event page. Our most popular volunteer opportunities are heritage walks and restoration projects.";
      } else if (lowerText.includes('membership') || lowerText.includes('benefits')) {
        aiResponse = "BWM membership offers free entry to all events, a quarterly heritage magazine, 10% discount at museum shops, and access to exclusive member-only tours. It's only RM50/year (RM20 for students)!";
      } else {
        aiResponse = "That's a great question! For specific inquiries, you can also contact our team at info@badanwarisan.org.my. Is there anything else you'd like to know about BWM?";
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'ai',
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* TOP-LEVEL: Main App Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={bwmLogo} alt="BWM Logo" className="w-10 h-10 rounded-xl" />
        </div>
        <h2 className="text-white font-['Lora'] flex-1 text-center">
          BWM Assistant
        </h2>
        <button className="text-white">
          <Bell size={24} />
        </button>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-36">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-[#0A402F] text-[#FFFBEA]'
                    : 'bg-white text-[#333333] shadow-sm'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-[#B48F5E] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-['Inter']">AI</span>
                    </div>
                    <span className="text-[#333333] opacity-70 font-['Inter']">BWM Assistant</span>
                  </div>
                )}
                <p className="font-['Inter']">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Prompts - Only show if there's just the welcome message */}
        {messages.length === 1 && (
          <div className="mt-6">
            <p className="text-[#333333] opacity-70 mb-3 font-['Inter']">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="bg-white border-2 border-[#0A402F] text-[#0A402F] rounded-full px-4 py-2 hover:bg-[#0A402F]/5 transition-colors font-['Inter']"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Input Bar (above bottom nav) - not fixed, uses flex positioning */}
      <div className="bg-[#FFFBEA] px-4 py-3 border-t border-gray-100">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend(inputText);
              }
            }}
            placeholder="Ask me anything about heritage..."
            className="flex-1 bg-white border-gray-300 rounded-full font-['Inter']"
          />
          <Button
            onClick={() => handleSend(inputText)}
            className="bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] rounded-full w-12 h-12 p-0 flex-shrink-0"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>

      {/* TOP-LEVEL: Bottom Navigation Bar */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Home size={24} />
            <span className="text-xs font-['Inter']">Home</span>
          </button>
          
          <button 
            onClick={() => onNavigate('donate')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <DollarSign size={24} />
            <span className="text-xs font-['Inter']">Donate</span>
          </button>
          
          <button 
            onClick={() => onNavigate('events')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Calendar size={24} />
            <span className="text-xs font-['Inter']">Events</span>
          </button>
          
          <button 
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <User size={24} />
            <span className="text-xs font-['Inter']">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
