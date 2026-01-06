import { supabase } from '../lib/admin-supabase-client.';
// Assuming the admin client is always configured since it has hardcoded keys in the file
const isSupabaseConfigured = true;
import { Event, EventRegistration, RegistrationFormData } from '../types/event';


/**
 * Fetch all upcoming events from admin_event_post
 */
export async function fetchEvents(): Promise<{ data: Event[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('admin_event_post')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return { data: null, error: new Error(error.message) };
    }

    const events: Event[] = (data || []).map((item: any) => ({
      id: item.id.toString(),
      title: item.event_title,
      date: item.date,
      time: item.time,
      location: item.location,
      description: item.description,
      poster_url: item.image_url,
      // Default values for fields not in admin_event_post
      status: 'upcoming',
      fee: item.fee || 'Free',
      member_fee: item.member_fee || 'Free',
      lat: 0,
      lng: 0,
      created_at: item.created_at
    }));

    return { data: events, error: null };
  } catch (err: any) {
    console.error('Exception fetching events:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetch a single event by ID
 */
export async function fetchEventById(eventId: string): Promise<{ data: Event | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('admin_event_post')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      return { data: null, error: new Error(error.message) };
    }

    const event: Event = {
      id: data.id.toString(),
      title: data.event_title,
      date: data.date,
      time: data.time,
      location: data.location,
      description: data.description,
      poster_url: data.image_url,
      status: 'upcoming',
      fee: data.fee || 'Free',
      member_fee: data.member_fee || 'Free',
      lat: 0,
      lng: 0,
      created_at: data.created_at
    };

    return { data: event, error: null };
  } catch (err: any) {
    console.error('Exception fetching event:', err);
    return { data: null, error: err };
  }
}


// Helper to get demo registrations from localStorage
function getDemoRegistrations(): string[] {
  try {
    const stored = localStorage.getItem('demo_registrations');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Helper to save demo registration to localStorage
function saveDemoRegistration(eventId: string): void {
  try {
    const current = getDemoRegistrations();
    if (!current.includes(eventId)) {
      current.push(eventId);
      localStorage.setItem('demo_registrations', JSON.stringify(current));
    }
  } catch (e) {
    console.error('Error saving demo registration:', e);
  }
}

/**
 * Register a user for an event
 */
export async function registerForEvent(
  eventId: string,
  formData: RegistrationFormData,
  userId?: string,
  isMember?: boolean
): Promise<{ data: EventRegistration | null; error: Error | null }> {
  // Use demo mode if Supabase is not configured
  if (!isSupabaseConfigured) {
    // Simulate successful registration in demo mode
    const mockRegistration: EventRegistration = {
      id: `demo-${Date.now()}`,
      event_id: eventId,
      user_id: userId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      is_member: isMember,
      registration_date: new Date().toISOString(),
      status: 'confirmed',
    };
    saveDemoRegistration(eventId);
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: mockRegistration, error: null };
  }

  try {
    // Find event details to snapshot
    // We now fetch from DB instead of dummyEvents
    const { data: event, error: eventError } = await fetchEventById(eventId);

    if (eventError || !event) {
      return { data: null, error: new Error('Event not found') };
    }

    const { error } = await supabase
      .from('event_registrations')
      .insert({
        user_id: userId,
        event_id: event.id,
        event_title: event.title,
        event_date: event.date,
        event_location: event.location,
        event_image_url: event.poster_url,
        registrant_name: formData.name,
        registrant_email: formData.email,
        registrant_phone: formData.phone,
        status: 'registered'
      });

    if (error) {
      console.error('Error registering for event:', error);
      throw error;
    }

    // Return a constructed response matching the interface
    const response: EventRegistration = {
      event_id: eventId,
      user_id: userId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      is_member: isMember,
      registration_date: new Date().toISOString(),
      status: 'confirmed'
    };

    return { data: response, error: null };
  } catch (err: any) {
    console.error('Exception registering for event:', err);
    return { data: null, error: err };
  }
}

/**
 * Check if a user is already registered for an event
 */
export async function checkRegistration(
  eventId: string,
  email: string
): Promise<{ isRegistered: boolean; error: Error | null }> {
  if (!isSupabaseConfigured) {
    // Demo mode: always return not registered
    return { isRegistered: false, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('registrant_email', email)
      .maybeSingle();

    if (error) {
      console.error('Error checking registration:', error);
      return { isRegistered: false, error: null };
    }

    return { isRegistered: !!data, error: null };
  } catch (err) {
    console.error('Exception checking registration:', err);
    return { isRegistered: false, error: null };
  }
}

/**
 * Fetch all events a user has registered for
 */
export async function fetchUserRegisteredEvents(
  userId?: string,
  email?: string
): Promise<{ data: Event[] | null; error: Error | null }> {
  // Demo mode: return events the user has registered for
  if (!isSupabaseConfigured) {
    // Since we removed dummyEvents, we can't return details for demo registrations 
    // unless we fetch them from DB, but this is "Supabase not configured" block.
    // So we just return empty array or handle gracefully.
    return { data: [], error: null };
  }

  try {
    if (!userId) return { data: [], error: null };

    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Map back to Event interface
    const events: Event[] = data.map((reg: any) => ({
      id: reg.event_id,
      title: reg.event_title,
      date: reg.event_date,
      time: '',
      location: reg.event_location,
      description: 'Registered Event',
      poster_url: reg.event_image_url,
      status: 'upcoming',
      fee: 'RM0', // Placeholder
      member_fee: 'RM0', // Placeholder
      member_free: false
    }));

    return { data: events, error: null };
  } catch (err: any) {
    console.error('Exception fetching user registered events:', err);
    return { data: null, error: err };
  }
}
