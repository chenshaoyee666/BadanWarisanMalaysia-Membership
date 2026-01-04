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
    Search,
    Loader2,
    Trash2,
    FileSpreadsheet
} from 'lucide-react';
import { supabase } from './supabase-client'; // Ensure this path is correct

// --- Types ---
interface Event {
    id: number;
    created_at?: string;
    event_title: string;
    description: string;
    date: string;
    location: string;
    image_url?: string;
}

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'home' | 'create' | 'downloads'>('home');
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Form State
    const [newEvent, setNewEvent] = useState<Partial<Event>>({
        event_title: '',
        date: '',
        location: '',
        description: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // --- 1. Fetch Events Logic ---
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

    useEffect(() => {
        fetchEvents();
    }, []);

    // --- 2. Image Upload Logic ---
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("File selected:", file.name); // Debug log
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- 3. CSV Logic (Integrated Locally) ---
    const handleDownloadCSV = () => {
        if (events.length === 0) {
            alert("No events to download.");
            return;
        }

        // define headers
        const headers = ['ID', 'Title', 'Date', 'Location', 'Description', 'Image URL'];

        // map data
        const rows = events.map(e => [
            e.id,
            `"${e.event_title.replace(/"/g, '""')}"`, // Escape quotes
            e.date,
            `"${e.location.replace(/"/g, '""')}"`,
            `"${e.description.replace(/"/g, '""')}"`,
            e.image_url || ''
        ]);

        // combine
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `events_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- 4. Submit Logic ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let publicImageUrl = '';

            // Upload Image
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                // IMPORTANT: Ensure your bucket 'event_poster' is Public in Supabase Dashboard
                const { error: uploadError } = await supabase.storage.from('event_poster').upload(filePath, imageFile);

                if (uploadError) {
                    console.error("Upload Error:", uploadError);
                    throw new Error(`Image upload failed: ${uploadError.message}`);
                }

                const { data } = supabase.storage.from('event_poster').getPublicUrl(filePath);
                publicImageUrl = data.publicUrl;
            }

            // Insert Database Record
            const { error: dbError } = await supabase.from('admin_event_post').insert([{
                event_title: newEvent.event_title,
                description: newEvent.description,
                date: newEvent.date,
                location: newEvent.location,
                image_url: publicImageUrl
            }]);

            if (dbError) throw dbError;

            // Reset
            setNewEvent({ event_title: '', date: '', location: '', description: '', image_url: '' });
            setImagePreview(null);
            setImageFile(null);
            await fetchEvents();
            setActiveTab('home');
            alert("Event created successfully!");

        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEvent = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            const { error } = await supabase.from('admin_event_post').delete().eq('id', id);
            if (error) throw error;
            await fetchEvents();
        } catch (error: any) {
            alert(`Error deleting event: ${error.message}`);
        }
    };

    // --- Views ---

    const renderDashboard = () => (
        <div className="pb-32 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-white min-h-screen">
            <div className="px-6 pt-8 pb-4 bg-white sticky top-0 z-10">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-[#003829]">My Events</h1>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                        {isLoading ? 'Updating...' : `${events.length} Active Events`}
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A884]/20 transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="px-6 space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <p className="text-sm">Loading events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pt-24 text-center px-8">
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            No events found. Create one to get started!
                        </p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform duration-100">
                            <div className="h-36 w-full bg-gray-100 relative">
                                {event.image_url ? (
                                    <img src={event.image_url} alt={event.event_title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-300">
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-[#00A884] shadow-sm uppercase tracking-wide">
                                    Active
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{event.event_title}</h3>
                                    <button onClick={() => handleDeleteEvent(event.id)} className="text-gray-300 p-2 -mr-2 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={13} className="text-[#00A884]" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                                        <MapPin size={13} className="text-[#00A884]" />
                                        <span className="truncate">{event.location}</span>
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
        <div className="bg-white min-h-screen pb-32 animate-in slide-in-from-right duration-300">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white z-20">
                <button onClick={() => setActiveTab('home')} className="p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="font-bold text-lg text-gray-900">Create New Event</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">

                {/* Image Upload - Fixed Layout */}
                <div className="w-full">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Event Poster</label>
                    <div className="w-full h-48 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#00A884] transition-colors bg-gray-50 relative overflow-hidden group">
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm">
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer w-full h-full z-10">
                                <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="text-[#00A884]" size={24} />
                                </div>
                                <span className="text-xs font-semibold text-gray-500">Tap to upload image</span>
                                {/* Input must be here */}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Form Inputs - Fixed Spacing & Borders */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title</label>
                        <input required type="text" placeholder="e.g. Annual Dinner"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A884] focus:ring-4 focus:ring-[#00A884]/10 transition-all outline-none font-medium text-gray-900"
                            value={newEvent.event_title} onChange={(e) => setNewEvent({ ...newEvent, event_title: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date</label>
                            <input required type="date"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A884] focus:ring-4 focus:ring-[#00A884]/10 transition-all outline-none text-sm font-medium"
                                value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Location</label>
                            <input required type="text" placeholder="Venue"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A884] focus:ring-4 focus:ring-[#00A884]/10 transition-all outline-none text-sm font-medium"
                                value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                        <textarea required placeholder="Event details..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A884] focus:ring-4 focus:ring-[#00A884]/10 transition-all outline-none min-h-[120px] text-sm leading-relaxed"
                            value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 safe-area-bottom z-30">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#00A884] disabled:bg-[#00A884]/60 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#00A884]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                        {isSubmitting ? 'Publishing...' : 'Publish Event'}
                    </button>
                </div>
            </form>
        </div>
    );

    const renderDownloads = () => (
        <div className="pb-32 bg-white min-h-screen animate-in slide-in-from-right duration-300">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white z-20">
                <button onClick={() => setActiveTab('home')} className="p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-50">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="font-bold text-lg text-gray-900">Reports</h2>
            </div>

            <div className="p-6 flex flex-col items-center justify-center pt-20">
                <div className="bg-[#00A884]/10 p-6 rounded-full mb-6">
                    <FileSpreadsheet className="text-[#00A884]" size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Export Events Data</h3>
                <p className="text-gray-500 text-center text-sm mb-8 max-w-xs">
                    Download a CSV file containing details of all {events.length} active events currently in the system.
                </p>

                <button
                    onClick={handleDownloadCSV}
                    className="w-full max-w-xs bg-[#003829] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <Download size={20} />
                    Download CSV
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 max-w-md mx-auto relative flex flex-col shadow-2xl">
            <div className="flex-1 overflow-y-auto hide-scrollbar">
                {activeTab === 'home' && renderDashboard()}
                {activeTab === 'create' && renderCreateEvent()}
                {activeTab === 'downloads' && renderDownloads()}
            </div>

            {/* Custom Floating Navigation Bar */}
            {activeTab !== 'create' && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-[80px] max-w-md mx-auto z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="relative flex justify-between items-center h-full px-12">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-[#00A884]' : 'text-gray-400'}`}
                        >
                            <div className={`p-1.5 rounded-lg ${activeTab === 'home' ? 'bg-[#00A884]/10' : ''}`}>
                                <Calendar size={22} strokeWidth={2.5} />
                            </div>
                            <span className="text-[10px] font-bold">Events</span>
                        </button>

                        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                            <button
                                onClick={() => setActiveTab('create')}
                                className="bg-[#00A884] text-white w-14 h-14 rounded-full shadow-lg shadow-[#00A884]/40 flex items-center justify-center active:scale-95 transition-transform hover:bg-[#008f70] border-4 border-white"
                            >
                                <Plus size={28} strokeWidth={3} />
                            </button>
                        </div>

                        <button
                            onClick={() => setActiveTab('downloads')}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'downloads' ? 'text-[#00A884]' : 'text-gray-400'}`}
                        >
                            <div className={`p-1.5 rounded-lg ${activeTab === 'downloads' ? 'bg-[#00A884]/10' : ''}`}>
                                <Download size={22} strokeWidth={2.5} />
                            </div>
                            <span className="text-[10px] font-bold">Reports</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;