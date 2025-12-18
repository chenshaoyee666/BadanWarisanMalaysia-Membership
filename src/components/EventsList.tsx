import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Bell, Home, DollarSign, User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Event } from '../types/event';
import { fetchEvents } from '../services/eventService';
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
    
    const { data, error } = await fetchEvents();
    
    if (error) {
      setError('Failed to load events. Please try again.');
      console.error(error);
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
      {/* TOP-LEVEL: Main App Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={bwmLogo} alt="BWM Logo" className="w-10 h-10 rounded-xl" />
          <h2 className="text-[#FFFBEA] font-['Lora']">Events</h2>
        </div>
        <button className="text-[#FFFBEA]">
          <Bell size={24} />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#0A402F] animate-spin mb-4" />
            <p className="text-[#333333] opacity-70 font-['Inter']">Loading events...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-[#d4183d] mb-4 font-['Inter']">{error}</p>
            <Button 
              onClick={loadEvents}
              className="bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] rounded-xl font-['Inter']"
            >
              Try Again
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-[#0A402F] opacity-30 mb-4" />
            <p className="text-[#333333] opacity-70 font-['Inter']">No upcoming events</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all hover:shadow-md active:scale-[0.99]"
                onClick={() => handleEventClick(event)}
              >
                <ImageWithFallback 
                  src={event.poster_url}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-[#333333] font-['Lora'] mb-2">{event.title}</h3>
                  
                  <div className="flex items-center text-[#333333] opacity-70 mb-2 font-['Inter']">
                    <Calendar size={16} className="mr-2 text-[#B48F5E]" />
                    <span>{event.date}{event.time && ` @ ${event.time}`}</span>
                  </div>
                  
                  <div className="flex items-center text-[#333333] opacity-70 mb-3 font-['Inter']">
                    <MapPin size={16} className="mr-2 text-[#B48F5E]" />
                    <span>{event.location}</span>
                  </div>
                  
                  <p className="text-[#333333] opacity-70 mb-4 font-['Inter'] line-clamp-2">
                    {event.description.split('\n')[0]}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#0A402F] font-medium font-['Inter']">{event.fee || 'Free'}</span>
                      {event.member_free && event.fee !== 'Free' && (
                        <span className="text-[#B48F5E] ml-2 text-sm font-['Inter']">Free for members</span>
                      )}
                    </div>
                    <Button 
                      className="bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] rounded-xl font-['Inter']"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
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

      {/* TOP-LEVEL: Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Home size={24} />
            <span className="text-xs font-['Inter']">Home</span>
          </button>
          
          <button 
            onClick={() => onNavigate('donate')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <DollarSign size={24} />
            <span className="text-xs font-['Inter']">Donate</span>
          </button>
          
          <button 
            onClick={() => onNavigate('events')}
            className="flex flex-col items-center gap-1 text-[#0A402F]"
          >
            <Calendar size={24} />
            <span className="text-xs font-['Inter']">Events</span>
          </button>
          
          <button 
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <User size={24} />
            <span className="text-xs font-['Inter']">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
