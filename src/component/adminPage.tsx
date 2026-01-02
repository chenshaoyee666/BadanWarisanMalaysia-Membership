import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
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
  FileText, // Import FileText icon
  Loader2,
  Trash2
} from 'lucide-react';
import { downloadTableAsCsv, generateAndSaveReport, downloadReportFromStorage, deleteReport } from './csv_file_logic';
// Import the supabase client you created
import { supabase } from '../supabase-client';

// --- Types ---
interface Event {
  id: number; // Changed to number to match 'int8' in your Supabase table
  created_at?: string;
  event_title: string; // Matches Supabase column name
  description: string;
  date: string;
  location: string;
  image_url?: string;
}

const AdminPage = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'create' | 'downloads'>('home');

  // Data State
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [reportHistory, setReportHistory] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Form State
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    event_title: '',
    date: '',
    location: '',
    description: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // --- Supabase Logic ---

  // Fetch all events from the 'admin_event_post' table
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_event_post')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching events:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchEvents();
    fetchReportHistory();
  }, []);

  const fetchReportHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('report_history')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReportHistory(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await generateAndSaveReport();
      await fetchReportHistory(); // Refresh list
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(`Failed to generate report: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = async (id: string, filePath: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await deleteReport(id, filePath);
      await fetchReportHistory(); // Refresh list
    } catch (error: any) {
      alert(`Failed to delete report: ${error.message}`);
    }
  };

  // Handle image selection (Preview only for now)
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Set the file for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let publicImageUrl = '';

      // 1. Upload image to Supabase Storage if a file exists
      if (imageFile) {
        // generate file path
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('event_poster')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // 2. Get the Public URL
        const { data } = supabase.storage
          .from('event_poster')
          .getPublicUrl(filePath);

        publicImageUrl = data.publicUrl;
      }

      // 3. Insert into the 'admin_event_post' table
      const { error: dbError } = await supabase
        .from('admin_event_post')
        .insert([
          {
            event_title: newEvent.event_title,
            description: newEvent.description,
            date: newEvent.date,
            location: newEvent.location,
            image_url: publicImageUrl // Make sure this column exists in your table!
          },
        ]);

      if (dbError) throw dbError;

      // Reset Form
      setNewEvent({ event_title: '', date: '', location: '', description: '', image_url: '' });
      setImagePreview(null);
      setImageFile(null);
      await fetchEvents();
      setActiveTab('home');

    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('admin_event_post')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh list
      await fetchEvents();
    } catch (error: any) {
      alert(`Error deleting event: ${error.message}`);
    }
  };

  // --- Views ---

  const renderDashboard = () => (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="px-5 pt-6 pb-4 bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-950">My Events</h1>
            <p className="text-xs text-gray-500 font-medium">
              {isLoading ? 'Updating...' : `${events.length} Active Events`}
            </p>
          </div>
        </div>
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="text-sm">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>No events found. Create one to get started!</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform duration-100">
              <div className="h-32 w-full bg-gray-100 relative">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.event_title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-300">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-800 shadow-sm">
                  Active
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{event.event_title}</h3>
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

                <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                  {event.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div>
                    <span className="text-emerald-700 font-bold text-lg">0</span>
                    <span className="text-gray-400 text-xs ml-1">Registered</span>
                  </div>
                  <div className="flex gap-2">

                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderCreateEvent = () => (
    <div className="bg-white min-h-screen pb-24 animate-in slide-in-from-right duration-300">
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
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Event Poster</label>
          <div className="aspect-video rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-500 transition-colors bg-gray-50 relative overflow-hidden group">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageFile(null); }}
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

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Title</label>
            <input
              required
              type="text"
              placeholder="e.g. Annual Dinner"
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all font-medium text-gray-900"
              value={newEvent.event_title}
              onChange={(e) => setNewEvent({ ...newEvent, event_title: e.target.value })}
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

        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 safe-area-bottom">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 disabled:bg-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
            {isSubmitting ? 'Publishing...' : 'Publish Event'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderDownloads = () => (
    <div className="bg-white min-h-screen pb-24 animate-in slide-in-from-right duration-300">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20">
        <h2 className="font-bold text-lg text-gray-900">Reports</h2>
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : '+ Generate New'}
        </button>
      </div>

      <div className="p-5 space-y-4">
        {reportHistory.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            <p>No reports generated yet.</p>
          </div>
        ) : (
          reportHistory.map((report) => (
            <div key={report.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{report.file_name}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Generated: {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadReportFromStorage(report.file_path, report.file_name)}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Download size={16} />
                  Download CSV
                </button>
                <button
                  onClick={() => handleDeleteReport(report.id, report.file_path)}
                  className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-100 transition-colors active:scale-95"
                  title="Delete Report"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <div className="h-full overflow-y-auto hide-scrollbar">
        {activeTab === 'home' && renderDashboard()}
        {activeTab === 'create' && renderCreateEvent()}
        {activeTab === 'downloads' && renderDownloads()}
      </div>

      {activeTab === 'home' && (
        <div className="fixed left-0 right-0 bottom-0 flex justify-center items-end pointer-events-none z-30">
          <button
            onClick={() => setActiveTab('create')}
            className="relative translate-y-1/2 bg-emerald-600 text-white w-16 h-16 rounded-full shadow-xl shadow-emerald-300 flex items-center justify-center active:scale-90 transition-transform pointer-events-auto border-4 border-white z-40"
            style={{ marginBottom: 'calc(3.5rem + 8px)' }}
          >
            <Plus size={32} />
          </button>
        </div>
      )}

      {activeTab !== 'create' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center p-3 pb-6 max-w-md mx-auto z-20">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center ${activeTab === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            <div className={`px-5 py-1.5 rounded-full mb-1 ${activeTab === 'home' ? 'bg-emerald-50' : ''}`}>
              <Calendar size={20} />
            </div>
            <span className="text-[10px] font-bold">Events</span>
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex flex-col items-center ${activeTab === 'downloads' ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            <div className={`px-5 py-1.5 rounded-full mb-1 ${activeTab === 'downloads' ? 'bg-emerald-50' : ''}`}>
              <Download size={20} />
            </div>
            <span className="text-[10px] font-medium">Reports</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminPage;