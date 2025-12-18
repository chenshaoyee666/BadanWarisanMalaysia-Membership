import { ArrowLeft, Plus, Heart, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeritageJournalProps {
  onNavigate: (screen: string) => void;
}

const journalEntries = [
  {
    id: 1,
    title: 'My Visit to Rumah Penghulu',
    date: '25 Oct 2025',
    event: 'Traditional Architecture Workshop',
    image: 'https://images.unsplash.com/photo-1593857389276-7c794900c90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxheXNpYW4lMjBoZXJpdGFnZSUyMHRyYWRpdGlvbmFsJTIwaG91c2V8ZW58MXx8fHwxNzYyNDE0NjIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    note: "It was amazing to see the intricate wood carvings up close. The craftsmanship and attention to detail is truly remarkable. I learned so much about traditional Malay architecture today!",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    title: 'Heritage Walk in KL',
    date: '15 Sep 2025',
    event: 'Kuala Lumpur Heritage Walk',
    image: 'https://images.unsplash.com/photo-1759850344068-717929375834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLdWFsYSUyMEx1bXB1ciUyMGhlcml0YWdlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyNDE0NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    note: "Walking through the historic heart of KL was incredible. The Sultan Abdul Samad Building is even more beautiful in person. Our guide shared fascinating stories about the colonial era.",
    likes: 8,
    comments: 2,
  },
  {
    id: 3,
    title: 'Discovering Penang Heritage',
    date: '5 Aug 2025',
    event: 'George Town Walking Tour',
    image: 'https://images.unsplash.com/photo-1567591475317-b6450160f9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB2aXNpdGluZyUyMGhpc3RvcmljYWwlMjBtb251bWVudHxlbnwxfHx8fDE3NjI0MTQ5ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    note: "George Town is a treasure trove of heritage! The mix of Chinese, Malay, and British architecture creates such a unique atmosphere. I especially loved the traditional shophouses.",
    likes: 15,
    comments: 5,
  },
];

export function HeritageJournal({ onNavigate }: HeritageJournalProps) {
  return (
    <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => onNavigate('profile')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-white font-['Lora'] ml-4">My Journal</h2>
        </div>
        <Button className="bg-[#B8860B] hover:bg-[#B8860B]/90 text-[#FEFDF5] rounded-full w-10 h-10 p-0">
          <Plus size={20} />
        </Button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-6">
        {/* Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-[#333333] font-['Lora'] mb-2">Your Heritage Memories</h3>
          <p className="text-[#333333] opacity-70">
            Document your experiences at BWM events. Share photos and reflections to inspire others!
          </p>
        </div>

        {/* Journal Entries */}
        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Image */}
              <ImageWithFallback
                src={entry.image}
                alt={entry.title}
                className="w-full h-56 object-cover"
              />

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-[#333333] font-['Lora']">{entry.title}</h4>
                    <p className="text-[#333333] opacity-70 mt-1">{entry.date}</p>
                  </div>
                </div>

                {/* Event Tag */}
                <div className="inline-block bg-[#0A402F]/10 rounded-full px-3 py-1 mb-3">
                  <span className="text-[#0A402F]">{entry.event}</span>
                </div>

                {/* Note */}
                <p className="text-[#333333] opacity-80 leading-relaxed mb-4">
                  {entry.note}
                </p>

                {/* Interaction Bar */}
                <div className="flex items-center gap-6 pt-3 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-[#333333] opacity-70 hover:opacity-100 transition-opacity">
                    <Heart size={18} />
                    <span>{entry.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-[#333333] opacity-70 hover:opacity-100 transition-opacity">
                    <MessageCircle size={18} />
                    <span>{entry.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - if no entries */}
        {journalEntries.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#0A402F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-[#0A402F]" size={32} />
            </div>
            <h3 className="text-[#333333] font-['Lora'] mb-2">Start Your Journal</h3>
            <p className="text-[#333333] opacity-70 mb-4">
              Attend an event and create your first journal entry!
            </p>
            <Button className="bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FEFDF5]">
              View Upcoming Events
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
