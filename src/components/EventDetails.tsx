import { ArrowLeft, Calendar, MapPin, Home, DollarSign, User } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventDetailsProps {
  onNavigate: (screen: string) => void;
}

export function EventDetails({ onNavigate }: EventDetailsProps) {
  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* SUB-PAGE: Simple Header with Back Button and Title */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center gap-4">
        <button onClick={() => onNavigate('events')} className="text-[#FFFBEA]">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[#FFFBEA] font-['Lora'] flex-1 text-center mr-6">Event Details</h2>
      </header>

      {/* Hero Image */}
      <div className="relative">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1759850344068-717929375834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLdWFsYSUyMEx1bXB1ciUyMGhlcml0YWdlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyNDE0NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Heritage Walk: KL"
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-32">
        {/* Event Title */}
        <h2 className="text-[#333333] font-['Lora'] mb-4">Heritage Walk: Kuala Lumpur</h2>
        
        {/* Date and Time */}
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={20} className="text-[#B48F5E]" />
          <span className="text-[#333333]">Sat, 20 Dec 2025 @ 9:00 AM</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-6">
          <MapPin size={20} className="text-[#B48F5E]" />
          <span className="text-[#333333]">Starts at Badan Warisan Malaysia</span>
        </div>

        {/* Organizer Section */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <p className="text-[#333333] opacity-70 mb-3">Organized by</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0A402F] rounded-xl flex items-center justify-center">
              <span className="text-[#FFFBEA] font-['Lora']">BWM</span>
            </div>
            <span className="text-[#333333]">Badan Warisan Malaysia</span>
          </div>
        </div>

        {/* About This Event */}
        <div className="mb-6">
          <h3 className="text-[#333333] font-['Lora'] mb-3">About this event</h3>
          <p className="text-[#333333] opacity-70 leading-relaxed mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-[#333333] opacity-70 leading-relaxed mb-3">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
          </p>
          <p className="text-[#333333] opacity-70 leading-relaxed">
            Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>
        </div>

        {/* Map Placeholder */}
        <div className="mb-6">
          <h3 className="text-[#333333] font-['Lora'] mb-3">Location</h3>
          <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center">
            <span className="text-gray-500">Map</span>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
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

      {/* Sticky Bottom Button (above nav) */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <Button className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] h-12 rounded-xl font-['Inter']">
            Book Now - RM20
          </Button>
        </div>
      </div>
    </div>
  );
}
