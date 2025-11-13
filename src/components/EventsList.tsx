import { Calendar, MapPin, Bell, Home, DollarSign, User } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bwmLogo from 'figma:asset/0d1febf7746d940532ad6ebe58464b3c717cca4a.png';

interface EventsListProps {
  onNavigate: (screen: string) => void;
}

const events = [
  {
    id: 1,
    title: "Kuala Lumpur Heritage Walk",
    date: "25 NOV 2025",
    location: "Merdeka Square, KL",
    description: "Explore the colonial architecture and historic sites of downtown Kuala Lumpur",
    image: "https://images.unsplash.com/photo-1759850344068-717929375834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLdWFsYSUyMEx1bXB1ciUyMGhlcml0YWdlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyNDE0NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    fee: "RM20",
    memberFree: true
  },
  {
    id: 2,
    title: "Penang Heritage Workshop",
    date: "5 DEC 2025",
    location: "George Town, Penang",
    description: "Learn traditional crafts and conservation techniques from local artisans",
    image: "https://images.unsplash.com/photo-1760026506473-c2967f2dc07d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxheXNpYSUyMGNvbG9uaWFsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MjQxNDYyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    fee: "RM35",
    memberFree: false
  },
  {
    id: 3,
    title: "Malacca Historical Tour",
    date: "15 DEC 2025",
    location: "Malacca City",
    description: "Journey through 600 years of history in Malaysia's UNESCO World Heritage Site",
    image: "https://images.unsplash.com/photo-1761402511821-1e61a1469670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJpdGFnZSUyMHdhbGtpbmclMjB0b3VyfGVufDF8fHx8MTc2MjQxNDYyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    fee: "Free",
    memberFree: true
  },
  {
    id: 4,
    title: "Traditional Architecture Talk",
    date: "20 DEC 2025",
    location: "Online Webinar",
    description: "Discover the unique features of traditional Malay architecture and design",
    image: "https://images.unsplash.com/photo-1593857389276-7c794900c90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxheXNpYW4lMjBoZXJpdGFnZSUyMHRyYWRpdGlvbmFsJTIwaG91c2V8ZW58MXx8fHwxNzYyNDE0NjIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    fee: "Free",
    memberFree: true
  }
];

export function EventsList({ onNavigate }: EventsListProps) {
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
        {/* Event Cards */}
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <ImageWithFallback 
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-[#333333] font-['Lora'] mb-2">{event.title}</h3>
                
                <div className="flex items-center text-[#333333] opacity-70 mb-2 font-['Inter']">
                  <Calendar size={16} className="mr-2" />
                  <span>{event.date}</span>
                </div>
                
                <div className="flex items-center text-[#333333] opacity-70 mb-3 font-['Inter']">
                  <MapPin size={16} className="mr-2" />
                  <span>{event.location}</span>
                </div>
                
                <p className="text-[#333333] opacity-70 mb-4 font-['Inter']">{event.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#0A402F] font-['Inter']">{event.fee}</span>
                    {event.memberFree && (
                      <span className="text-[#B48F5E] ml-2 font-['Inter']">Free for members</span>
                    )}
                  </div>
                  <Button 
                    className="bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] rounded-xl font-['Inter']"
                    onClick={() => onNavigate('event-details')}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* TOP-LEVEL: Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center max-w-md mx-auto">
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
