// Event type definition matching Supabase schema
export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  description: string;
  poster_url: string;
  location: string;
  lat?: number;
  lng?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  fee?: string;
  member_fee?: string;
  created_at?: string;
  updated_at?: string;
}

// Registration type definition
export interface EventRegistration {
  id?: string;
  event_id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  is_member?: boolean;
  registration_date?: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
  created_at?: string;
}

// Form data for registration
export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
}

