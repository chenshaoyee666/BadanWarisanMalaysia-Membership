// src/services/faqList.ts
// This file acts like a simple "database" for FAQ (fixed Q&A).

export type FaqItem = {
    id: number;
    question: string;
    answer: string;
    keywords: string[]; // optional keyword matching (kept for future extension)
};

export const faqs: FaqItem[] = [
    {
        id: 1,
        question: "When is the next event?",
        keywords: ["event", "next", "upcoming", "date"],
        answer:
            "Our next event is the Kuala Lumpur Heritage Walk on November 25, 2025. It's a guided tour through KL's colonial architecture. Would you like to book a spot?",
    },
    {
        id: 2,
        question: "Tell me about Rumah Penghulu",
        keywords: ["rumah", "penghulu", "house", "restoration"],
        answer:
            "Rumah Penghulu is a beautiful traditional Malay house that we're currently restoring. We've raised RM15,000 of our RM20,000 goal. Every donation helps preserve this piece of Malaysian heritage!",
    },
    {
        id: 3,
        question: "How can I become a volunteer?",
        keywords: ["volunteer", "join", "help", "contribute"],
        answer:
            "You can become a volunteer by registering through any event page. Common volunteer roles include assisting heritage walks and supporting restoration activities.",
    },
    {
        id: 4,
        question: "What are the membership benefits?",
        keywords: ["membership", "benefits", "member"],
        answer:
            "BWM membership offers free entry to selected events, a quarterly heritage newsletter, discounts at partner shops, and access to member-only tours. Student membership is available at a lower fee.",
    },

    // --- Additional FAQs (your leader asked: add more questions) ---
    {
        id: 5,
        question: "How do I donate to BWM?",
        keywords: ["donate", "donation", "payment"],
        answer:
            "You can donate via the Donate page using available payment methods such as QR payment, card, or e-wallet (depending on the implementation). Every donation helps heritage conservation efforts.",
    },
    {
        id: 6,
        question: "Where can I find the Events page?",
        keywords: ["events", "page", "calendar"],
        answer:
            "You can tap the Events icon in the bottom navigation bar to view upcoming events and details.",
    },
    {
        id: 7,
        question: "How do I join a heritage walk?",
        keywords: ["join", "heritage walk", "book"],
        answer:
            "Open the Events page, select a heritage walk event, and follow the registration/booking instructions shown on the event details screen.",
    },
    {
        id: 8,
        question: "What is BWM’s mission?",
        keywords: ["mission", "goal", "purpose"],
        answer:
            "BWM aims to preserve and promote Malaysia’s built heritage and cultural legacy through advocacy, education, community programs, and restoration initiatives.",
    },
    {
        id: 9,
        question: "Can I donate without membership?",
        keywords: ["donate", "membership", "without"],
        answer:
            "Yes. Donations are open to everyone. Membership is optional and provides additional member benefits.",
    },
    {
        id: 10,
        question: "How do I contact BWM for more info?",
        keywords: ["contact", "email", "support"],
        answer:
            "For more information, you may contact the team via email: info@badanwarisan.org.my",
    },
];
