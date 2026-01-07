// src/services/chatbotService.ts
// This file contains the chatbot "backend logic" for fixed FAQ responses.

import { faqs } from "./faqList.ts";

/**
 * Get answer by exact question match.
 * This is perfect for an FAQ-only chatbot (no user typing).
 */
export function getAnswerByQuestion(question: string): string {
    const found = faqs.find((f) => f.question === question);
    if (found) return found.answer;

    // If something unexpected happens (e.g., question not found), return safe fallback.
    return "Sorry, I cannot find an answer for that question yet. Please choose another FAQ option.";
}
