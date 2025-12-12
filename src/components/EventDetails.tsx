import React, { useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin,
  Home,
  DollarSign,
  User
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Event } from '../types/event';
import { useAuth } from '../contexts/AuthContext';
import bwmLogo from '../assets/BWM logo.png';

interface EventDetailsProps {
  onNavigate: (screen: string) => void;
  event: Event;
}

export function EventDetails({ onNavigate, event }: EventDetailsProps) {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top when component mounts
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [event.id]);

  // Format description with proper paragraphs
  const descriptionParagraphs = event.description.split('\n').filter(p => p.trim());

  // Calculate if event is free for this user
  const isFreeForUser = event.fee === 'Free' || (event.member_free && user);
  const displayPrice = isFreeForUser ? 'Free' : event.fee;

  // Generate Google Maps embed URL
  const getMapEmbedUrl = () => {
    if (event.lat && event.lng) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${event.lat},${event.lng}&zoom=15`;
    }
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(event.location)}`;
  };

  return (
    <div ref={scrollRef} className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => onNavigate('events')} 
          className="text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-white font-['Lora'] text-2xl flex-1 text-center mr-6" style={{ fontWeight: 700 }}>Event Details</h2>
      </header>

      {/* Hero Image */}
      <div className="relative">
        <ImageWithFallback 
          src={event.poster_url}
          alt={event.title}
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-24">
        {/* Event Title */}
        <h1 className="text-[#333333] font-['Lora'] text-xl mb-4">{event.title}</h1>
        
        {/* Date and Time */}
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={20} className="text-[#B48F5E]" />
          <span className="text-[#333333] font-['Inter']">
            {event.date}{event.time && ` @ ${event.time}`}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={20} className="text-[#B48F5E]" />
          <span className="text-[#333333] font-['Inter']">{event.location}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[#0A402F] font-semibold font-['Inter']">{displayPrice}</span>
          {event.member_free && event.fee !== 'Free' && (
            <span className="text-[#B48F5E] text-sm font-['Inter']">• Free for members</span>
          )}
        </div>

        {/* Organizer */}
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <p className="text-[#333333] opacity-50 text-sm mb-2 font-['Inter']">Organized by</p>
          <div className="flex items-center gap-3">
            <img src={bwmLogo} alt="BWM Logo" className="w-10 h-10 rounded-lg object-cover" />
            <span className="text-[#333333] font-['Inter']">Badan Warisan Malaysia</span>
          </div>
        </div>

        {/* About This Event */}
        <div className="mb-6">
          <h3 className="text-[#333333] font-['Lora'] text-lg mb-3">About this event</h3>
          {descriptionParagraphs.map((paragraph, index) => (
            <p 
              key={index} 
              className="text-[#333333] opacity-70 leading-relaxed mb-3 last:mb-0 font-['Inter']"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Map Section */}
        {(event.lat && event.lng) && (
          <div className="mb-6">
            <h3 className="text-[#333333] font-['Lora'] text-lg mb-3">Location</h3>
            <div className="rounded-xl overflow-hidden h-48">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={getMapEmbedUrl()}
              />
            </div>
            <a 
              href={`https://maps.google.com/?q=${event.lat},${event.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B48F5E] text-sm font-['Inter'] hover:underline mt-2 inline-block"
            >
              Open in Google Maps →
            </a>
          </div>
        )}

        {/* Register Button */}
        <button 
          onClick={() => onNavigate('event-registration')}
          className="w-full bg-[#0A402F] hover:bg-[#083525] text-white h-12 rounded-xl font-['Inter'] font-medium text-base"
        >
          Register Now {displayPrice !== 'Free' && `- ${displayPrice}`}
        </button>
      </main>

      {/* Bottom Navigation Bar */}
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
