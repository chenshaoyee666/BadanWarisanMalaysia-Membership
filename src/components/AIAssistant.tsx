// src/components/AIAssistant.tsx
// FAQ-only AI Assistant (no user typing). Click options to get answers.
// English comments included as requested.

import { Bell, Home, DollarSign, Calendar, User } from "lucide-react";
import { useState } from "react";
import bwmLogo from "figma:asset/0d1febf7746d940532ad6ebe58464b3c717cca4a.png";

import { faqs } from "../services/faqList";
import { getAnswerByQuestion } from "../services/chatbotService";

interface AIAssistantProps {
    onNavigate: (screen: string) => void;
}

interface Message {
    id: number;
    text: string;
    sender: "ai" | "user";
    isLoading?: boolean; // used to show "thinking..." bubble
}

// FAQ button list (always shown)
const suggestedPrompts = faqs.map((f) => f.question);

export function AIAssistant({ onNavigate }: AIAssistantProps) {
    // Initial welcome message
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hi! I'm your AI Heritage Assistant. Please choose a question below.",
            sender: "ai",
        },
    ]);

    /**
     * User clicks an FAQ option:
     * 1) Add user's selected question
     * 2) Add a loading AI message ("thinking...")
     * 3) Replace loading message with final answer after a short delay
     */
    const handleFaqClick = (question: string) => {
        // 1) Add user message + loading AI message in one update (to keep ordering correct)
        setMessages((prev) => {
            const nextId = prev.length + 1;

            const userMsg: Message = {
                id: nextId,
                text: question,
                sender: "user",
            };

            const loadingMsg: Message = {
                id: nextId + 1,
                text: "BWM Assistant is thinking...",
                sender: "ai",
                isLoading: true,
            };

            return [...prev, userMsg, loadingMsg];
        });

        // 2) After 1 second, replace the latest loading message with the real answer
        setTimeout(() => {
            const answer = getAnswerByQuestion(question);

            setMessages((prev) => {
                // Replace the most recent loading AI message
                const updated = [...prev];
                for (let i = updated.length - 1; i >= 0; i--) {
                    if (updated[i].sender === "ai" && updated[i].isLoading) {
                        updated[i] = {
                            ...updated[i],
                            text: answer,
                            isLoading: false,
                        };
                        break;
                    }
                }
                return updated;
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
            {/* Header */}
            <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={bwmLogo} alt="BWM Logo" className="w-10 h-10 rounded-xl" />
                    <h2 className="text-[#FFFBEA] font-['Lora']">BWM Assistant</h2>
                </div>
                <button className="text-[#FFFBEA]">
                    <Bell size={24} />
                </button>
            </header>

            {/* Chat + FAQ Options */}
            <main className="flex-1 px-4 py-6 overflow-y-auto pb-28">
                {/* Chat Messages */}
                <div className="space-y-4">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 ${
                                    m.sender === "user"
                                        ? "bg-[#0A402F] text-[#FFFBEA]"
                                        : "bg-white text-[#333333] shadow-sm"
                                }`}
                            >
                                {m.sender === "ai" && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 bg-[#B48F5E] rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-['Inter']">AI</span>
                                        </div>
                                        <span className="text-[#333333] opacity-70 font-['Inter']">
                      BWM Assistant
                    </span>
                                    </div>
                                )}

                                {/* If loading, show italic style to simulate AI thinking */}
                                <p className={`font-['Inter'] ${m.isLoading ? "italic opacity-70" : ""}`}>
                                    {m.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Suggested FAQ Buttons - ALWAYS shown (can be clicked repeatedly) */}
                <div className="mt-6">
                    <p className="text-[#333333] opacity-70 mb-3 font-['Inter']">
                        Suggested questions (tap to ask):
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {suggestedPrompts.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleFaqClick(q)}
                                className="bg-white border-2 border-[#0A402F] text-[#0A402F] rounded-full px-4 py-2 hover:bg-[#0A402F]/5 transition-colors font-['Inter']"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-10">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    <button
                        onClick={() => onNavigate("home")}
                        className="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <Home size={24} />
                        <span className="text-xs font-['Inter']">Home</span>
                    </button>

                    <button
                        onClick={() => onNavigate("donate")}
                        className="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <DollarSign size={24} />
                        <span className="text-xs font-['Inter']">Donate</span>
                    </button>

                    <button
                        onClick={() => onNavigate("events")}
                        className="flex flex-col items-center gap-1 text-gray-400"
                    >
                        <Calendar size={24} />
                        <span className="text-xs font-['Inter']">Events</span>
                    </button>

                    <button
                        onClick={() => onNavigate("profile")}
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
