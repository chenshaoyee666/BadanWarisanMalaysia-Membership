import React, { useState, ChangeEvent } from 'react';
import {
  Calendar,
  MapPin,
  Download,
  Plus,
  Image as ImageIcon,
  UploadCloud,
  X,
  Check,
  ChevronLeft,
  MoreVertical,
  Search,
  Bell
} from 'lucide-react';

// --- Types ---
interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  registeredCount: number;
  imageUrl?: string;
}

// --- Mock Data ---
const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Warisan Cultural Night',
    date: '2024-12-25',
    location: 'Dewan Suarah Sibu',
    description: 'A night celebrating our shared heritage.',
    registeredCount: 145,
    imageUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Clean-up Drive',
    date: '2024-12-30',
    location: 'Sibu Town Square',
    description: 'Volunteers gathering to keep our city clean.',
    registeredCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800'
  }
];

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'create'>('home');
  
  // Data State
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  
  // Form State
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    date: '',
    location: '',
    description: '',
    registeredCount: 0
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- Handlers ---
  const handleDownloadCSV = (eventTitle: string) => {
    // Simulating CSV download behavior
    alert(`Downloading CSV for: ${eventTitle}`);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setNewEvent(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const event: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title || 'Untitled Event',
      date: newEvent.date || new Date().toISOString().split('T')[0],
      location: newEvent.location || 'TBD',
      description: newEvent.description || '',
      registeredCount: 0,
      imageUrl: newEvent.imageUrl
    };
    
    setEvents([event, ...events]);
    
    // Reset form
    setNewEvent({ title: '', date: '', location: '', description: '', registeredCount: 0 });
    setImagePreview(null);
    setActiveTab('home');
  };

  // --- Views ---

  // 1. Dashboard View (Mobile List)
  const renderDashboard = () => (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="px-5 pt-6 pb-4 bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-950">My Events</h1>
            <p className="text-xs text-gray-500 font-medium">{events.length} Active Events</p>
          </div>
          <button className="bg-gray-50 p-2 rounded-full text-gray-600 hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform duration-100">
            {/* Image Area */}
            <div className="h-32 w-full bg-gray-100 relative">
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-300">
                  <ImageIcon size={32} />
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-800 shadow-sm">
                Active
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{event.title}</h3>
                <button className="text-gray-400 p-1">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-emerald-600" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1 truncate max-w-[120px]">
                  <MapPin size={12} className="text-emerald-600" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              {/* Stats & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div>
                  <span className="text-emerald-700 font-bold text-lg">{event.registeredCount}</span>
                  <span className="text-gray-400 text-xs ml-1">Registered</span>
                </div>
                <button 
                  onClick={() => handleDownloadCSV(event.title)}
                  className="bg-emerald-50 text-emerald-700 p-2 rounded-lg hover:bg-emerald-100 transition-colors"
                  aria-label="Download CSV"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 2. Create Event View (Mobile Form)
  const renderCreateEvent = () => (
    <div className="bg-white min-h-screen pb-24 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white z-20">
        <button 
          onClick={() => setActiveTab('home')}
          className="p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-bold text-lg text-gray-900">Create New Event</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-6">
        {/* Image Upload Area */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Event Poster</label>
          <div className="aspect-video rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-500 transition-colors bg-gray-50 relative overflow-hidden group">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => { setImagePreview(null); setNewEvent({...newEvent, imageUrl: undefined}); }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-emerald-500" size={24} />
                </div>
                <span className="text-xs font-semibold text-gray-500">Tap to upload image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Title</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Annual Dinner"
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all font-medium text-gray-900"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Date</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-0 text-sm font-medium"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Location</label>
              <input 
                required
                type="text" 
                placeholder="Venue"
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-0 text-sm font-medium"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Description</label>
            <textarea 
              required
              placeholder="Event details..."
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all min-h-[120px] text-sm leading-relaxed"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 safe-area-bottom">
          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Publish Event
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      {/* Content */}
      <div className="h-full overflow-y-auto hide-scrollbar">
        {activeTab === 'home' ? renderDashboard() : renderCreateEvent()}
      </div>

      {/* Floating Action Button (FAB) for Home Screen */}
      {activeTab === 'home' && (
        <button
          onClick={() => setActiveTab('create')}
          className="fixed bottom-6 right-6 bg-emerald-600 text-white w-14 h-14 rounded-full shadow-xl shadow-emerald-300 flex items-center justify-center active:scale-90 transition-transform z-30"
        >
          <Plus size={28} />
        </button>
      )}

      {/* Mobile Bottom Nav (Optional, showing active state) */}
      {activeTab === 'home' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center p-3 pb-6 max-w-md mx-auto z-20">
          <button className="flex flex-col items-center text-emerald-600">
            <div className="bg-emerald-50 px-5 py-1.5 rounded-full mb-1">
              <Calendar size={20} />
            </div>
            <span className="text-[10px] font-bold">Events</span>
          </button>
          
          <button className="flex flex-col items-center text-gray-400">
            <div className="px-5 py-1.5 rounded-full mb-1">
              <Download size={20} />
            </div>
            <span className="text-[10px] font-medium">Reports</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;