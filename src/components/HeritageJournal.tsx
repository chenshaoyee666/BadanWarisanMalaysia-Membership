import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Heart, MessageCircle, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchJournalEntries, createJournalEntry } from '../services/heritageService';
import { JournalEntry } from '../types/heritage';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface HeritageJournalProps {
  onNavigate: (screen: string) => void;
}

// Default demo entries for first-time users
const defaultEntries: JournalEntry[] = [
  {
    id: 'demo-1',
    user_id: 'demo',
    title: 'My Visit to Rumah Penghulu',
    content: "It was amazing to see the intricate wood carvings up close. The craftsmanship and attention to detail is truly remarkable. I learned so much about traditional Malay architecture today!",
    image_url: 'https://images.unsplash.com/photo-1593857389276-7c794900c90f?w=800',
    created_at: '2025-10-25T10:00:00Z',
  },
  {
    id: 'demo-2',
    user_id: 'demo',
    title: 'Heritage Walk in KL',
    content: "Walking through the historic heart of KL was incredible. The Sultan Abdul Samad Building is even more beautiful in person. Our guide shared fascinating stories about the colonial era.",
    image_url: 'https://images.unsplash.com/photo-1759850344068-717929375834?w=800',
    created_at: '2025-09-15T10:00:00Z',
  },
];

export function HeritageJournal({ onNavigate }: HeritageJournalProps) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    setLoading(true);
    const { data } = await fetchJournalEntries(user?.id);
    // If no entries from service, show default demo entries
    if (data && data.length > 0) {
      setEntries(data);
    } else {
      setEntries(defaultEntries);
    }
    setLoading(false);
  };

  const handleAddEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    setSaving(true);
    const { data, error } = await createJournalEntry({
      user_id: user?.id || 'anonymous',
      title: newEntry.title,
      content: newEntry.content,
    });

    if (error) {
      toast.error('Failed to save entry');
    } else if (data) {
      setEntries([data, ...entries]);
      toast.success('Journal entry saved!');
      setShowAddModal(false);
      setNewEntry({ title: '', content: '' });
    }
    setSaving(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => onNavigate('profile')} className="text-[#FEFDF5] mr-4">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-[#FEFDF5]">My Journal</h2>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#B8860B] hover:bg-[#B8860B]/90 text-[#FEFDF5] rounded-full w-10 h-10 p-0"
        >
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

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[#0A402F]" size={32} />
          </div>
        )}

        {/* Journal Entries */}
        {!loading && (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                {/* Image */}
                {entry.image_url && (
                  <ImageWithFallback
                    src={entry.image_url}
                    alt={entry.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-[#333333] font-['Lora']">{entry.title}</h4>
                      <p className="text-[#333333] opacity-70 text-sm mt-1">{formatDate(entry.created_at)}</p>
                    </div>
                  </div>

                  {/* Note */}
                  <p className="text-[#333333] opacity-80 leading-relaxed mb-4">
                    {entry.content}
                  </p>

                  {/* Interaction Bar */}
                  <div className="flex items-center gap-6 pt-3 border-t border-gray-200">
                    <button className="flex items-center gap-2 text-[#333333] opacity-70 hover:opacity-100 transition-opacity">
                      <Heart size={18} />
                      <span>0</span>
                    </button>
                    <button className="flex items-center gap-2 text-[#333333] opacity-70 hover:opacity-100 transition-opacity">
                      <MessageCircle size={18} />
                      <span>0</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && entries.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#0A402F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-[#0A402F]" size={32} />
            </div>
            <h3 className="text-[#333333] font-['Lora'] mb-2">Start Your Journal</h3>
            <p className="text-[#333333] opacity-70 mb-4">
              Attend an event and create your first journal entry!
            </p>
            <Button
              onClick={() => onNavigate('events')}
              className="bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FEFDF5]"
            >
              View Upcoming Events
            </Button>
          </div>
        )}
      </main>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-['Lora'] text-[#333333]">New Journal Entry</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#333333] mb-2">Title</label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  placeholder="e.g., My Visit to Rumah Penghulu"
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm text-[#333333] mb-2">Your Experience</label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="Share your thoughts and memories..."
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0A402F]"
                />
              </div>

              <Button
                onClick={handleAddEntry}
                disabled={saving}
                className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-12"
              >
                {saving ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
