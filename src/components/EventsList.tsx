import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Bell, Home, DollarSign, User as UserIcon, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Event } from './EventModal';
import { fetchEvents } from './EventService';
import bwmLogo from '../assets/BWM logo.png';

interface EventsListProps {
  onNavigate: (screen: string) => void;
  onSelectEvent: (event: Event) => void;
}

export function EventsList({ onNavigate, onSelectEvent }: EventsListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);

    // This now calls the modified service that maps Admin DB to User UI
    const { data, error } = await fetchEvents();

    if (error) {
      setError('Failed to load events.');
    } else if (data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleEventClick = (event: Event) => {
    onSelectEvent(event);
    onNavigate('event-details');
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={bwmLogo} alt="BWM Logo" className="w-10 h-10 rounded-xl" />
          <h2 className="text-[#FFFBEA] font-['Lora']">Events</h2>
        </div>
        <button className="text-[#FFFBEA]"><Bell size={24} /></button>
      </header>

      <main className="flex-1 px-4 py-6 overflow-y-auto pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#0A402F] animate-spin mb-4" />
            <p className="text-[#333333] opacity-70">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-[#0A402F] opacity-30 mb-4" />
            <p className="text-[#333333] opacity-70">No upcoming events</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all hover:shadow-md active:scale-[0.99]"
                onClick={() => handleEventClick(event)}
              >
                {/* Ensure mapped poster_url is used */}
                <ImageWithFallback
                  src={event.poster_url}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-[#333333] font-['Lora'] mb-2">{event.title}</h3>
                  <div className="flex items-center text-[#333333] opacity-70 mb-2 font-['Inter']">
                    <Calendar size={16} className="mr-2 text-[#B48F5E]" />
                    {/* Time is optional now, handled by service default */}
                    <span>{event.date} {event.time && `@ ${event.time}`}</span>
                  </div>
                  <div className="flex items-center text-[#333333] opacity-70 mb-3 font-['Inter']">
                    <MapPin size={16} className="mr-2 text-[#B48F5E]" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-[#333333] opacity-70 mb-4 font-['Inter'] line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#0A402F] font-medium font-['Inter']">{event.fee}</span>
                    </div>
                    <Button
                      className="bg-[#0A402F] text-[#FFFBEA] rounded-xl font-['Inter']"
                      onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Navbar code remains same... */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
        {/* ... existing navbar code ... */}
      </nav>
    </div>
  );
}