// src/services/chatbotService.ts
// This file contains the chatbot "backend logic" for fixed FAQ responses.

import { faqs } from "./faqList.ts";
import { dummyEvents } from "./eventService.ts";

// Heritage site data (simplified for chatbot use)
const rumahPenghuluInfo = {
    name: "Rumah Penghulu",
    description: "Traditional Malay house showcasing heritage architecture",
    location: "Rumah Penghulu, Kuala Lumpur",
    fundsRaised: 15000,
    fundingGoal: 20000,
};

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

/**
 * Get dynamic answer from database for specific questions.
 * Returns null if the question doesn't need dynamic data.
 */
export async function getDynamicAnswer(question: string): Promise<string | null> {
    // Handle "When is the next event?" - fetch from events data
    if (question === "When is the next event?") {
        const upcomingEvents = dummyEvents
            .filter((e) => e.status === "upcoming")
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (upcomingEvents.length > 0) {
            const nextEvent = upcomingEvents[0];
            return `Our next event is **${nextEvent.title}** on ${nextEvent.date} at ${nextEvent.time}. 📍 Location: ${nextEvent.location}. ${nextEvent.member_free ? "Free for members!" : `Fee: ${nextEvent.fee}`} Would you like to register?`;
        }
        return "No upcoming events at the moment. Please check back later!";
    }

    // Handle "Tell me about Rumah Penghulu" - fetch heritage info + related events
    if (question === "Tell me about Rumah Penghulu") {
        const relatedEvents = dummyEvents.filter(
            (e) => e.location.toLowerCase().includes("rumah penghulu") && e.status === "upcoming"
        );

        let response = `🏛️ **${rumahPenghuluInfo.name}** is a beautiful traditional Malay house that we're currently restoring. `;
        response += `We've raised RM${rumahPenghuluInfo.fundsRaised.toLocaleString()} of our RM${rumahPenghuluInfo.fundingGoal.toLocaleString()} goal. `;
        response += `Every donation helps preserve this piece of Malaysian heritage!`;

        if (relatedEvents.length > 0) {
            const event = relatedEvents[0];
            response += `\n\n📅 **Upcoming Event:** ${event.title} on ${event.date} at ${event.time}. `;
            response += event.member_free ? "Free for members!" : `Fee: ${event.fee}`;
        }

        return response;
    }

    // Return null for non-dynamic questions (use static answer)
    return null;
}
