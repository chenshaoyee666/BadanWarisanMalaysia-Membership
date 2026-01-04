import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, MapPin, Home, DollarSign, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Event } from './EventModal';
import { useAuth } from '../contexts/AuthContext';
import bwmLogo from '../assets/BWM logo.png';

interface EventDetailsProps {
  onNavigate: (screen: string) => void;
  event: Event;
}

export function EventDetails({ onNavigate, event }: EventDetailsProps) {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [event.id]);

  const descriptionParagraphs = event.description ? event.description.split('\n').filter(p => p.trim()) : [];

  // Conditional Map Logic: Only show if valid lat/lng exist
  const showMap = event.lat && event.lng && event.lat !== 0 && event.lng !== 0;

  return (
    <div ref={scrollRef} className="min-h-screen bg-[#FFFBEA] flex flex-col">
      <header className="bg-[#0A402F] px-4 py-4 flex items-center gap-4">
        <button onClick={() => onNavigate('events')} className="text-white"><ArrowLeft size={24} /></button>
        <h2 className="text-white font-['Lora'] text-2xl flex-1 text-center mr-6 font-bold">Event Details</h2>
      </header>

      <div className="relative">
        <ImageWithFallback
          src={event.poster_url}
          alt={event.title}
          className="w-full h-64 object-cover"
        />
      </div>

      <main className="flex-1 px-4 py-6 overflow-y-auto pb-24">
        <h1 className="text-[#333333] font-['Lora'] text-xl mb-4">{event.title}</h1>

        <div className="flex items-center gap-2 mb-3">
          <Calendar size={20} className="text-[#B48F5E]" />
          <span className="text-[#333333] font-['Inter']">
            {event.date} {event.time && `@ ${event.time}`}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <MapPin size={20} className="text-[#B48F5E]" />
          <span className="text-[#333333] font-['Inter']">{event.location}</span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-[#0A402F] font-semibold font-['Inter']">{event.fee || 'Free'}</span>
        </div>

        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <p className="text-[#333333] opacity-50 text-sm mb-2 font-['Inter']">Organized by</p>
          <div className="flex items-center gap-3">
            <img src={bwmLogo} alt="BWM Logo" className="w-10 h-10 rounded-lg object-cover" />
            <span className="text-[#333333] font-['Inter']">Badan Warisan Malaysia</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-[#333333] font-['Lora'] text-lg mb-3">About this event</h3>
          {descriptionParagraphs.map((paragraph, index) => (
            <p key={index} className="text-[#333333] opacity-70 leading-relaxed mb-3 font-['Inter']">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Only render map if coordinates exist from Admin (currently they don't, so this hides gracefully) */}
        {showMap && (
          <div className="mb-6">
            <h3 className="text-[#333333] font-['Lora'] text-lg mb-3">Location</h3>
            <div className="rounded-xl overflow-hidden h-48 bg-gray-200">
              {/* Map Iframe logic here */}
            </div>
          </div>
        )}

        <button
          onClick={() => onNavigate('event-registration')}
          className="w-full bg-[#0A402F] text-white h-12 rounded-xl font-['Inter'] font-medium text-base"
        >
          Register Now
        </button>
      </main>

      {/* Navbar code remains same... */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
        {/* ... existing navbar code ... */}
      </nav>
    </div>
  );
}