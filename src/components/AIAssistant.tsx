// src/components/AIAssistant.tsx
// FAQ-only AI Assistant with Top 5 questions and categorized More Questions section.
// Features: BWM logo in header, database integration for dynamic answers, fixed layout.

import { Bell, Home, DollarSign, Calendar, User, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { getTopFaqs, getOtherFaqs, categoryLabels, FaqCategory } from "../services/faqList";
import { getAnswerByQuestion, getDynamicAnswer } from "../services/chatbotService";
import bwmLogo from "../assets/BWM logo.png";

interface AIAssistantProps {
    onNavigate: (screen: string) => void;
}

interface Message {
    id: number;
    text: string;
    sender: "ai" | "user";
    isLoading?: boolean;
}

// Get top 5 priority questions and other FAQs
const topFaqs = getTopFaqs();
const otherFaqs = getOtherFaqs();

// Group other FAQs by category
const groupedFaqs = otherFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
        acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
}, {} as Record<FaqCategory, typeof otherFaqs>);

// Simple markdown-like bold text renderer
function renderFormattedText(text: string) {
    // Split by **text** pattern and render bold
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
        // Odd indices are the bold parts (captured groups)
        if (index % 2 === 1) {
            return <strong key={index}>{part}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
}

export function AIAssistant({ onNavigate }: AIAssistantProps) {
    // Initial welcome message
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hi! I'm your AI Heritage Assistant. Please choose a question below.",
            sender: "ai",
        },
    ]);

    // State for "More Questions" collapsible section
    const [showMoreQuestions, setShowMoreQuestions] = useState(false);

    // Ref for auto-scrolling chat
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    /**
     * User clicks an FAQ option:
     * 1) Add user's selected question
     * 2) Add a loading AI message ("thinking...")
     * 3) Fetch dynamic answer if available, else use static answer
     * 4) Replace loading message with final answer
     */
    const handleFaqClick = async (question: string) => {
        // 1) Add user message + loading AI message
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

        // 2) Try to get dynamic answer from database
        let answer: string;
        try {
            const dynamicAnswer = await getDynamicAnswer(question);
            answer = dynamicAnswer || getAnswerByQuestion(question);
        } catch {
            answer = getAnswerByQuestion(question);
        }

        // 3) Replace loading message with the real answer after a short delay
        setTimeout(() => {
            setMessages((prev) => {
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
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
            {/* Header with BWM Logo */}
            <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <img src={bwmLogo} alt="BWM Logo" className="w-10 h-10 rounded-xl object-contain bg-white p-1" />
                    <h2 className="text-[#FFFBEA] font-['Lora'] text-lg font-semibold">BWM Assistant</h2>
                </div>
                <button className="text-[#FFFBEA]">
                    <Bell size={24} />
                </button>
            </header>

            {/* Main Content Area - Split into Chat and FAQ sections */}
            <div className="flex-1 flex flex-col overflow-hidden pb-20">

                {/* Chat Messages - Scrollable */}
                <div className="flex-1 overflow-y-auto px-4 py-4" style={{ maxHeight: "50vh" }}>
                    <div className="space-y-4">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 ${m.sender === "user"
                                        ? "bg-[#0A402F] text-[#FFFBEA]"
                                        : "bg-white text-[#333333] shadow-sm"
                                        }`}
                                >
                                    {m.sender === "ai" && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <img
                                                src={bwmLogo}
                                                alt="BWM"
                                                className="w-6 h-6 rounded-full object-contain bg-[#B48F5E] p-0.5"
                                            />
                                            <span className="text-[#333333] opacity-70 font-['Inter'] text-sm">
                                                BWM Assistant
                                            </span>
                                        </div>
                                    )}

                                    {/* Message text with loading style and markdown rendering */}
                                    <p className={`font-['Inter'] ${m.isLoading ? "italic opacity-70" : ""} whitespace-pre-line`}>
                                        {m.isLoading ? m.text : renderFormattedText(m.text)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* FAQ Section - Scrollable above the navigation */}
                <div className="shrink-0 px-4 py-4 bg-[#FFFBEA] border-t border-[#0A402F]/10 overflow-y-auto pb-24" style={{ maxHeight: "50vh" }}>
                    {/* TOP 5 Suggested Questions */}
                    <p className="text-[#333333] opacity-70 mb-3 font-['Inter'] text-sm">
                        Suggested questions (tap to ask):
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {topFaqs.map((faq) => (
                            <button
                                key={faq.id}
                                onClick={() => handleFaqClick(faq.question)}
                                className="bg-white border-2 border-[#0A402F] text-[#0A402F] rounded-full px-4 py-2 hover:bg-[#0A402F]/10 transition-colors font-['Inter'] text-sm"
                            >
                                {faq.question}
                            </button>
                        ))}
                    </div>

                    {/* MORE QUESTIONS - Collapsible Section with Categories */}
                    <button
                        onClick={() => setShowMoreQuestions(!showMoreQuestions)}
                        className="flex items-center gap-2 text-[#0A402F] font-['Inter'] font-medium hover:opacity-80 transition-opacity"
                    >
                        {showMoreQuestions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        More Questions
                    </button>

                    {showMoreQuestions && (
                        <div className="mt-4 space-y-5">
                            {(Object.keys(groupedFaqs) as FaqCategory[]).map((category) => (
                                <div key={category}>
                                    {/* Category Header */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">{categoryLabels[category].emoji}</span>
                                        <span className="font-['Inter'] font-medium text-[#333333]">
                                            {categoryLabels[category].label}
                                        </span>
                                    </div>

                                    {/* Category Questions */}
                                    <div className="flex flex-wrap gap-2">
                                        {groupedFaqs[category]?.map((faq) => (
                                            <button
                                                key={faq.id}
                                                onClick={() => handleFaqClick(faq.question)}
                                                className="bg-[#FFFBEA] border border-[#B48F5E] text-[#0A402F] rounded-full px-3 py-1.5 hover:bg-[#B48F5E]/10 transition-colors font-['Inter'] text-sm"
                                            >
                                                {faq.question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
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
