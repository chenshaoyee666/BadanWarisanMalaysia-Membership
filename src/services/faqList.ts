// src/services/faqList.ts
// This file acts like a simple "database" for FAQ (fixed Q&A).

export type FaqCategory = "about" | "events" | "support";

export type FaqItem = {
    id: number;
    question: string;
    answer: string;
    keywords: string[]; // optional keyword matching (kept for future extension)
    category: FaqCategory; // category for grouping
    priority?: boolean; // top 5 questions to show by default
    dynamic?: boolean; // if true, answer will be fetched from database
};

// Category display names and emojis
export const categoryLabels: Record<FaqCategory, { emoji: string; label: string }> = {
    about: { emoji: "🏛️", label: "About BWM" },
    events: { emoji: "🎟️", label: "Events & Activities" },
    support: { emoji: "💰", label: "Support & Membership" },
};

export const faqs: FaqItem[] = [
    // === TOP 5 PRIORITY QUESTIONS ===
    {
        id: 2,
        question: "Tell me about Rumah Penghulu",
        keywords: ["rumah", "penghulu", "house", "restoration"],
        answer:
            "Rumah Penghulu is a beautiful traditional Malay house that we're currently restoring. We've raised RM15,000 of our RM20,000 goal. Every donation helps preserve this piece of Malaysian heritage!",
        category: "about",
        priority: true,
        dynamic: true, // will fetch from heritage service
    },
    {
        id: 5,
        question: "How do I donate to BWM?",
        keywords: ["donate", "donation", "payment"],
        answer:
            "You can donate via the Donate page using available payment methods such as QR payment, card, or e-wallet (depending on the implementation). Every donation helps heritage conservation efforts.",
        category: "support",
        priority: true,
    },
    {
        id: 4,
        question: "What are the membership benefits?",
        keywords: ["membership", "benefits", "member"],
        answer:
            "BWM membership offers free entry to selected events, a quarterly heritage newsletter, discounts at partner shops, and access to member-only tours. Student membership is available at a lower fee.",
        category: "support",
        priority: true,
    },
    {
        id: 3,
        question: "How can I become a volunteer?",
        keywords: ["volunteer", "join", "help", "contribute"],
        answer:
            "You can become a volunteer by registering through any event page. Common volunteer roles include assisting heritage walks and supporting restoration activities.",
        category: "events",
        priority: true,
    },
    {
        id: 1,
        question: "When is the next event?",
        keywords: ["event", "next", "upcoming", "date"],
        answer:
            "Our next event is the Kuala Lumpur Heritage Walk on November 25, 2025. It's a guided tour through KL's colonial architecture. Would you like to book a spot?",
        category: "events",
        priority: true,
        dynamic: true, // will fetch from event service
    },

    // === OTHER FAQs (shown in "More Questions" section) ===
    {
        id: 8,
        question: "What is BWM's mission?",
        keywords: ["mission", "goal", "purpose"],
        answer:
            "BWM aims to preserve and promote Malaysia's built heritage and cultural legacy through advocacy, education, community programs, and restoration initiatives.",
        category: "about",
    },
    {
        id: 6,
        question: "Where can I find the Events page?",
        keywords: ["events", "page", "calendar"],
        answer:
            "You can tap the Events icon in the bottom navigation bar to view upcoming events and details.",
        category: "events",
    },
    {
        id: 7,
        question: "How do I join a heritage walk?",
        keywords: ["join", "heritage walk", "book"],
        answer:
            "Open the Events page, select a heritage walk event, and follow the registration/booking instructions shown on the event details screen.",
        category: "events",
    },
    {
        id: 9,
        question: "Can I donate without membership?",
        keywords: ["donate", "membership", "without"],
        answer:
            "Yes. Donations are open to everyone. Membership is optional and provides additional member benefits.",
        category: "support",
    },
    {
        id: 10,
        question: "How do I contact BWM for more info?",
        keywords: ["contact", "email", "support"],
        answer:
            "For more information, you may contact the team via email: info@badanwarisan.org.my",
        category: "support",
    },
];

// Helper functions to filter FAQs
export const getTopFaqs = () => faqs.filter((f) => f.priority);
export const getOtherFaqs = () => faqs.filter((f) => !f.priority);
export const getFaqsByCategory = (category: FaqCategory) => faqs.filter((f) => f.category === category && !f.priority);
