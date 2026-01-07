// src/services/chatbotService.ts
// This file contains the chatbot "backend logic" for fixed FAQ responses.
// Now integrated with real database for dynamic answers.

import { faqs } from "./faqList.ts";
import { fetchEvents, dummyEvents } from "./eventService.ts";
import { Event } from "../types/event.ts";

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
 * Parse date string to Date object
 * Handles formats like "25 NOV 2025" or "10 JAN 2026"
 */
function parseEventDate(dateStr: string): Date {
    const months: Record<string, number> = {
        JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
        JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
    };

    const parts = dateStr.split(' ');
    if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const month = months[parts[1].toUpperCase()] ?? 0;
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
    }

    // Fallback: try direct parsing
    return new Date(dateStr);
}

/**
 * Get dynamic answer from database for specific questions.
 * Returns null if the question doesn't need dynamic data.
 */
export async function getDynamicAnswer(question: string): Promise<string | null> {
    // Handle "When is the next event?" - fetch from real database
    if (question === "When is the next event?") {
        try {
            // Fetch events from Supabase (or fallback to demo data)
            const { data: events, error } = await fetchEvents();

            if (error || !events || events.length === 0) {
                // Fallback to demo data if database fails
                const fallbackEvents = dummyEvents.filter((e) => e.status === "upcoming");
                if (fallbackEvents.length > 0) {
                    const next = fallbackEvents[0];
                    return `Our next event is **${next.title}** on ${next.date} at ${next.time}. 📍 Location: ${next.location}. ${next.member_free ? "Free for members!" : `Fee: ${next.fee}`}`;
                }
                return "No upcoming events at the moment. Please check back later!";
            }

            // Filter upcoming events and sort by date
            const now = new Date();
            const upcomingEvents = events
                .filter((e: Event) => e.status === "upcoming")
                .filter((e: Event) => {
                    const eventDate = parseEventDate(e.date);
                    return eventDate >= now;
                })
                .sort((a: Event, b: Event) => {
                    const dateA = parseEventDate(a.date);
                    const dateB = parseEventDate(b.date);
                    return dateA.getTime() - dateB.getTime();
                });

            if (upcomingEvents.length > 0) {
                const nextEvent = upcomingEvents[0];
                return `Our next event is **${nextEvent.title}** on ${nextEvent.date} at ${nextEvent.time}. 📍 Location: ${nextEvent.location}. ${nextEvent.member_free ? "Free for members!" : `Fee: ${nextEvent.fee}`} Would you like to register?`;
            }

            return "No upcoming events at the moment. Please check back later!";
        } catch (err) {
            console.error("Error fetching events for chatbot:", err);
            return "Sorry, I couldn't fetch event information. Please try again later.";
        }
    }

    // Handle "Tell me about Rumah Penghulu" - fetch heritage info + related events
    if (question === "Tell me about Rumah Penghulu") {
        try {
            const { data: events } = await fetchEvents();
            const eventList = events || dummyEvents;

            const relatedEvents = eventList.filter(
                (e: Event) => e.location.toLowerCase().includes("rumah penghulu") && e.status === "upcoming"
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
        } catch (err) {
            console.error("Error fetching heritage info:", err);
            // Return basic info without events
            return `🏛️ **${rumahPenghuluInfo.name}** is a beautiful traditional Malay house that we're currently restoring. Every donation helps preserve this piece of Malaysian heritage!`;
        }
    }

    // Return null for non-dynamic questions (use static answer)
    return null;
}
