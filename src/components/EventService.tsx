import { supabase } from '../components/admin/supabase-client'; // Ensure path is correct
import { Event, RegistrationFormData } from './EventModal';

// Helper to map DB result to Event type
const mapDBToEvent = (item: any): Event => ({
    id: item.id,
    title: item.event_title,
    description: item.description,
    date: item.date,
    location: item.location,
    // Use the uploaded image, or a safe placeholder if missing
    poster_url: item.image_url || 'https://via.placeholder.com/400x200',

    // Map dynamic fields from DB. 
    // If DB is null, we return an empty string or specific fallback 
    // so the UI knows it's empty rather than "hardcoded".
    time: item.time || '',
    fee: item.fee || '',

    // Defaulting these since Admin doesn't have inputs for them yet.
    // To make these dynamic, you must add columns to your DB and inputs to AdminDashboard.
    member_free: true,
    lat: 0,
    lng: 0
});

// 1. Fetch ALL events (For Events List)
export const fetchEvents = async () => {
    try {
        const { data, error } = await supabase
            .from('admin_event_post')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedData = (data || []).map(mapDBToEvent);
        return { data: formattedData, error: null };
    } catch (error: any) {
        console.error('Error fetching events:', error.message);
        return { data: null, error: error.message };
    }
};

// 2. Fetch ONLY events the user has registered for (For Profile Screen)
export const fetchUserRegisteredEvents = async (userId?: string, userEmail?: string) => {
    try {
        if (!userId && !userEmail) return { data: [], error: 'No user identified' };

        let query = supabase
            .from('event_registrations')
            .select(`
                *,
                admin_event_post (
                    *
                )
            `);

        // Filter by User ID or Email
        if (userId) {
            query = query.eq('user_id', userId);
        } else if (userEmail) {
            query = query.eq('email', userEmail);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Map the nested 'admin_event_post' data to our Event structure
        const formattedData = (data || [])
            .filter(reg => reg.admin_event_post) // Ensure event still exists
            .map(reg => mapDBToEvent(reg.admin_event_post));

        return { data: formattedData, error: null };
    } catch (error: any) {
        console.error('Error fetching registered events:', error.message);
        return { data: null, error: error.message };
    }
};

// 3. Register for an event
export const registerForEvent = async (
    eventId: number,
    formData: RegistrationFormData,
    userId?: string,
    isMember?: boolean
) => {
    try {
        // Optional: Check if already registered
        const { data: existing } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', eventId)
            .eq('email', formData.email)
            .single();

        if (existing) {
            return { error: { message: 'You have already registered for this event.' } };
        }

        const { error } = await supabase
            .from('event_registrations')
            .insert([
                {
                    event_id: eventId,
                    user_id: userId || null,
                    full_name: formData.name,
                    email: formData.email,
                    phone_number: formData.phone,
                    created_at: new Date().toISOString(),
                    status: 'confirmed'
                }
            ]);

        if (error) throw error;
        return { error: null };
    } catch (error: any) {
        return { error };
    }
};