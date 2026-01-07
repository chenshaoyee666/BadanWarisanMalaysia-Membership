import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Event, EventRegistration, RegistrationFormData } from '../types/event';

// Dummy events data for demo mode (when Supabase is not configured)
export const dummyEvents: Event[] = [
  {
    id: '1',
    title: 'Kuala Lumpur Heritage Walk',
    date: '25 NOV 2025',
    time: '9:00 AM',
    location: 'Merdeka Square, KL',
    description: 'Explore the colonial architecture and historic sites of downtown Kuala Lumpur. Join us for a guided walking tour through the heart of Malaysia\'s capital, visiting iconic landmarks like the Sultan Abdul Samad Building, Merdeka Square, and the historic Masjid Jamek. Our expert guides will share fascinating stories of the city\'s rich multicultural heritage.\n\nThis 3-hour walk covers approximately 3km at a leisurely pace. Suitable for all fitness levels. Water and light refreshments provided.',
    poster_url: 'https://images.unsplash.com/photo-1759850344068-717929375834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLdWFsYSUyMEx1bXB1ciUyMGhlcml0YWdlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyNDE0NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 3.1488,
    lng: 101.6948,
    status: 'upcoming',
    fee: 'RM20',
    member_free: true,
  },
  {
    id: '2',
    title: 'Penang Heritage Workshop',
    date: '5 DEC 2025',
    time: '10:00 AM',
    location: 'George Town, Penang',
    description: 'Learn traditional crafts and conservation techniques from local artisans. This hands-on workshop takes place in a beautifully restored heritage shophouse in the heart of UNESCO-listed George Town.\n\nParticipants will learn the art of traditional Peranakan beadwork under the guidance of master craftsmen. All materials are provided, and you\'ll take home your own handcrafted piece.',
    poster_url: 'https://images.unsplash.com/photo-1760026506473-c2967f2dc07d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxheXNpYSUyMGNvbG9uaWFsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MjQxNDYyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 5.4164,
    lng: 100.3327,
    status: 'upcoming',
    fee: 'RM35',
    member_free: false,
  },
  {
    id: '3',
    title: 'A Famosa Fort Heritage Tour',
    date: '15 DEC 2025',
    time: '8:30 AM',
    location: 'A Famosa Fort, Malacca',
    description: 'Journey through 600 years of history at A Famosa Fort, Malaysia\'s iconic Portuguese fortress. This comprehensive tour covers the Portuguese, Dutch, and British colonial periods that shaped Malacca.\n\nExplore the ancient fort ruins, St. Paul\'s Church, and learn about the strategic importance of this historic stronghold. Experience the unique blend of Malay, Chinese, Indian, and European influences that make Malacca truly one-of-a-kind.',
    poster_url: 'https://images.unsplash.com/photo-1761402511821-1e61a1469670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJpdGFnZSUyMHdhbGtpbmclMjB0b3VyfGVufDF8fHx8MTc2MjQxNDYyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 2.1896,
    lng: 102.2501,
    status: 'upcoming',
    fee: 'Free',
    member_free: true,
  },
  {
    id: '4',
    title: 'Traditional Architecture Talk',
    date: '20 DEC 2025',
    time: '7:30 PM',
    location: 'Online Webinar',
    description: 'Discover the unique features of traditional Malay architecture and design. This online lecture is part of our Heritage Education Series, featuring Dr. Aziz Rahman, a leading expert in Southeast Asian architectural history.\n\nLearn about the ingenious climate-responsive design of traditional Malay houses, the symbolism in their ornamentation, and efforts to preserve these architectural treasures for future generations.',
    poster_url: 'https://images.unsplash.com/photo-1593857389276-7c794900c90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxheXNpYW4lMjBoZXJpdGFnZSUyMHRyYWRpdGlvbmFsJTIwaG91c2V8ZW58MXx8fHwxNzYyNDE0NjIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'upcoming',
    fee: 'Free',
    member_free: true,
  },
  {
    id: '5',
    title: 'Rumah Penghulu Heritage Experience',
    date: '10 JAN 2026',
    time: '10:00 AM',
    location: 'Rumah Penghulu, Kuala Lumpur',
    description: 'Step back in time and experience traditional Malay village life at Rumah Penghulu. This beautifully preserved traditional Malay house showcases authentic heritage architecture and craftsmanship.\n\nLearn about traditional Malay customs, try traditional games, and enjoy a demonstration of traditional cooking. The experience includes a guided tour by heritage experts who will explain the significance of every architectural detail.',
    poster_url: 'https://images.unsplash.com/photo-1593857389276-7c794900c90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxheXNpYW4lMjBoZXJpdGFnZSUyMHRyYWRpdGlvbmFsJTIwaG91c2V8ZW58MXx8fHwxNzYyNDE0NjIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 3.1412,
    lng: 101.6865,
    status: 'upcoming',
    fee: 'RM15',
    member_free: true,
  },
  {
    id: '6',
    title: 'Sultan Abdul Samad Building Night Tour',
    date: '18 JAN 2026',
    time: '7:00 PM',
    location: 'Sultan Abdul Samad Building, KL',
    description: 'Experience the majestic Sultan Abdul Samad Building illuminated at night. This iconic Moorish-style building, built in 1897, stands as a testament to Malaysia\'s colonial past and architectural heritage.\n\nOur expert guide will take you through the history of this magnificent structure, from its construction under British colonial rule to its role in Malaysia\'s independence. The evening tour offers stunning photography opportunities with the building beautifully lit against the night sky.',
    poster_url: 'https://images.unsplash.com/photo-1759850344068-717929375834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLdWFsYSUyMEx1bXB1ciUyMGhlcml0YWdlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyNDE0NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 3.1488,
    lng: 101.6938,
    status: 'upcoming',
    fee: 'RM25',
    member_free: true,
  },
  {
    id: '7',
    title: 'St. Mary\'s Cathedral Heritage Visit',
    date: '25 JAN 2026',
    time: '2:00 PM',
    location: 'St. Mary\'s Cathedral, KL',
    description: 'Discover the rich history of St. Mary\'s Cathedral, one of the oldest Anglican churches in Malaysia. Established in 1894, this Gothic-style cathedral has witnessed over a century of Malaysian history.\n\nJoin our guided tour to explore the beautiful stained glass windows, learn about the cathedral\'s architectural features, and hear stories of the prominent figures who have worshipped here. A peaceful oasis in the heart of bustling Kuala Lumpur.',
    poster_url: 'https://images.unsplash.com/photo-1760026506473-c2967f2dc07d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxheXNpYSUyMGNvbG9uaWFsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MjQxNDYyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    lat: 3.1502,
    lng: 101.6942,
    status: 'upcoming',
    fee: 'Free',
    member_free: true,
  },
];

// Set to false to use real Supabase data when configured
const USE_DEMO_DATA = false;

/**
 * Fetch all upcoming events
 * Returns dummy data if Supabase is not configured or USE_DEMO_DATA is true
 */
export async function fetchEvents(): Promise<{ data: Event[] | null; error: Error | null }> {
  // Use demo data during development or if Supabase is not configured
  if (USE_DEMO_DATA || !isSupabaseConfigured) {
    // Return dummy data for demo mode
    return { data: dummyEvents, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .in('status', ['upcoming', 'ongoing'])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      // Fall back to demo data if table doesn't exist
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log('Events table not found, using demo data');
        return { data: dummyEvents, error: null };
      }
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Event[], error: null };
  } catch (err) {
    console.error('Exception fetching events:', err);
    // Fall back to demo data on any error
    return { data: dummyEvents, error: null };
  }
}

/**
 * Fetch a single event by ID
 */
export async function fetchEventById(eventId: string): Promise<{ data: Event | null; error: Error | null }> {
  // Use demo data during development or if Supabase is not configured
  if (USE_DEMO_DATA || !isSupabaseConfigured) {
    // Return dummy data for demo mode
    const event = dummyEvents.find(e => e.id === eventId);
    return { data: event || null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      // Fall back to demo data
      const event = dummyEvents.find(e => e.id === eventId);
      return { data: event || null, error: null };
    }

    return { data: data as Event, error: null };
  } catch (err) {
    console.error('Exception fetching event:', err);
    const event = dummyEvents.find(e => e.id === eventId);
    return { data: event || null, error: null };
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
    const event = dummyEvents.find(e => e.id === eventId);
    if (!event) {
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

    // Also save to localStorage for heritage tracking compatibility
    saveDemoRegistration(eventId);

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
  // Use demo mode during development or if Supabase is not configured
  if (USE_DEMO_DATA || !isSupabaseConfigured) {
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
    const registeredEventIds = getDemoRegistrations();
    const registeredEvents = dummyEvents.filter(event => registeredEventIds.includes(event.id));
    return { data: registeredEvents, error: null };
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
      member_free: false
    }));

    return { data: events, error: null };
  } catch (err: any) {
    console.error('Exception fetching user registered events:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetch all event registrations for a user with full details (for My Tickets screen)
 */
export async function fetchUserRegistrationsWithDetails(
  userId?: string
): Promise<{ data: any[] | null; error: Error | null }> {
  // Demo mode: return mock registrations based on localStorage
  if (!isSupabaseConfigured) {
    const registeredEventIds = getDemoRegistrations();
    const registrations = dummyEvents
      .filter(event => registeredEventIds.includes(event.id))
      .map(event => ({
        id: `demo-reg-${event.id}`,
        event_id: event.id,
        user_id: userId || 'demo-user',
        event_title: event.title,
        event_date: event.date,
        event_location: event.location,
        event_image_url: event.poster_url,
        registrant_name: 'Demo User',
        registrant_email: 'demo@example.com',
        status: 'registered',
        created_at: new Date().toISOString()
      }));
    return { data: registrations, error: null };
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

    return { data: data || [], error: null };
  } catch (err: any) {
    console.error('Exception fetching user registrations:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetch a single registration by ID (for admin validation)
 */
export async function fetchRegistrationById(
  registrationId: string
): Promise<{ data: any | null; error: Error | null }> {
  // Demo mode
  if (!isSupabaseConfigured) {
    if (registrationId.startsWith('demo-reg-')) {
      const eventId = registrationId.replace('demo-reg-', '');
      const event = dummyEvents.find(e => e.id === eventId);
      if (event) {
        return {
          data: {
            id: registrationId,
            event_id: event.id,
            user_id: 'demo-user',
            event_title: event.title,
            event_date: event.date,
            event_location: event.location,
            event_image_url: event.poster_url,
            registrant_name: 'Demo User',
            registrant_email: 'demo@example.com',
            status: 'registered',
            created_at: new Date().toISOString()
          },
          error: null
        };
      }
    }
    return { data: null, error: new Error('Registration not found') };
  }

  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('id', registrationId)
      .single();

    if (error) {
      console.error('Error fetching registration:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error('Exception fetching registration:', err);
    return { data: null, error: err };
  }
}

/**
 * Mark a registration as attended (for admin check-in)
 */
export async function markRegistrationAttended(
  registrationId: string
): Promise<{ success: boolean; error: Error | null }> {
  // Demo mode: update in localStorage
  if (!isSupabaseConfigured) {
    console.log('Demo mode: Marking registration as attended:', registrationId);
    return { success: true, error: null };
  }

  try {
    console.log('Attempting to mark as attended:', registrationId);

    const { data, error } = await supabase
      .from('event_registrations')
      .update({ status: 'attended' })
      .eq('id', registrationId)
      .select();  // Add select to see what was updated

    console.log('Mark attended result:', { data, error });

    if (error) {
      console.error('Error updating registration:', error);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Exception updating registration:', err);
    return { success: false, error: err };
  }
}
