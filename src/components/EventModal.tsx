export interface Event {
    id: number; // Changed from string to number to match Admin DB
    title: string;
    description: string;
    date: string;
    location: string;
    poster_url: string; // We will map 'image_url' to this

    // Optional fields (Since Admin doesn't provide them yet)
    time?: string;
    fee?: string;
    member_free?: boolean;
    lat?: number;
    lng?: number;
}

export interface RegistrationFormData {
    name: string;
    email: string;
    phone: string;
}