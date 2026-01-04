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
    FileSpreadsheet,
    Clock,
    User,
    MoreVertical
} from 'lucide-react';
import { supabase } from './supabase-client';

// --- Types ---
interface Event {
    id: number;
    created_at?: string;
    event_title: string;
    description: string;
    date: string;
    location: string;
    image_url?: string;
    time?: string;
    fee?: string;
}

// Mock data for reports to match design
const MOCK_REPORTS = [
    { id: 1, title: 'All Events Report', date: '1/4/2026', time: '2:53:37 PM' },
    { id: 2, title: 'All Events Report', date: '1/4/2026', time: '2:38:27 PM' },
];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'home' | 'create' | 'downloads'>('home');
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Form State
    const [newEvent, setNewEvent] = useState<Partial<Event>>({
        event_title: '',
        date: '',
        time: '',
        fee: '',
        location: '',
        description: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // --- Fetch Events ---
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

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- CSV Logic ---
    const handleDownloadCSV = () => {
        if (events.length === 0) {
            alert("No events to download.");
            return;
        }
        const headers = ['ID', 'Title', 'Date', 'Time', 'Location', 'Fee', 'Description', 'Image URL'];
        const rows = events.map(e => [
            e.id,
            `"${e.event_title.replace(/"/g, '""')}"`,
            e.date,
            e.time || '',
            `"${e.location.replace(/"/g, '""')}"`,
            e.fee || '',
            `"${e.description.replace(/"/g, '""')}"`,
            e.image_url || ''
        ]);
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `events_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Submit Logic ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let publicImageUrl = '';
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;
                const { error: uploadError } = await supabase.storage.from('event_poster').upload(filePath, imageFile);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('event_poster').getPublicUrl(filePath);
                publicImageUrl = data.publicUrl;
            }

            const { error: dbError } = await supabase.from('admin_event_post').insert([{
                event_title: newEvent.event_title,
                description: newEvent.description,
                date: newEvent.date,
                time: newEvent.time,
                fee: newEvent.fee,
                location: newEvent.location,
                image_url: publicImageUrl
            }]);

            if (dbError) throw dbError;

            setNewEvent({ event_title: '', date: '', time: '', fee: '', location: '', description: '', image_url: '' });
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

    const renderDashboard = () => (
        <div className="pb-32 animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="px-6 pt-8 pb-6 bg-white sticky top-0 z-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#003829]">My Events</h1>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                        {isLoading ? 'Updating...' : `${events.length} Active Events`}
                    </p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00A884] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-100/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00A884]/20 focus:bg-white transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Event Grid */}
            <div className="px-4 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-24">
                {isLoading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 text-gray-400">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <p className="text-sm">Loading events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center pt-24 text-center px-8">
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">No events found. Create one to get started!</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
                            {/* Image Section */}
                            <div className="h-44 w-full bg-gray-100 relative overflow-hidden">
                                {event.image_url ? (
                                    <img
                                        src={event.image_url}
                                        alt={event.event_title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-emerald-300">
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#003829] shadow-sm uppercase tracking-wide">
                                    Active
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-[#003829] text-xl leading-tight line-clamp-1">{event.event_title}</h3>
                                    <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>

                                {/* Date & Location */}
                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-[#00A884]" strokeWidth={2.5} />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} className="text-[#00A884]" strokeWidth={2.5} />
                                        <span className="truncate max-w-[100px]">{event.location}</span>
                                    </div>
                                </div>

                                {/* Fee Box */}
                                <div className="bg-[#ebfbf7] rounded-lg px-4 py-3 flex justify-between items-center mb-4">
                                    <span className="text-xs font-semibold text-[#008f70]">Registration Fee</span>
                                    <span className="text-sm font-bold text-[#003829]">{event.fee || 'Free'}</span>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                                    {event.description}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5 text-[#00A884] font-semibold text-sm">
                                        <span className='text-lg'>0</span>
                                        <span className="text-xs font-medium text-gray-400">Registered</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
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
            <div className="px-5 py-4 flex items-center gap-3 sticky top-0 bg-white z-20">
                <button onClick={() => setActiveTab('home')} className="p-2 -ml-2 text-gray-500 rounded-full hover:bg-gray-50 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="font-bold text-xl text-[#003829]">Create New Event</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-8 max-w-3xl mx-auto">
                {/* Poster Upload */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Event Poster</label>
                    <div className="w-full h-56 rounded-3xl border-2 border-dashed border-gray-200 hover:border-[#00A884] transition-colors bg-gray-50/50 relative overflow-hidden group">
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-sm"><X size={16} /></button>
                            </>
                        ) : (
                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer w-full h-full z-10 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 text-[#00A884]">
                                    <UploadCloud size={24} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-semibold text-gray-500">Tap to upload image</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Core Info */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Title</label>
                        <input required type="text" placeholder="e.g. Annual Dinner" className="w-full px-5 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#00A884]/20 focus:border-[#00A884] transition-all outline-none font-semibold text-gray-700 placeholder:text-gray-400 placeholder:font-normal" value={newEvent.event_title} onChange={(e) => setNewEvent({ ...newEvent, event_title: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</label>
                            <input required type="date" className="w-full px-5 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#00A884]/20 focus:border-[#00A884] transition-all outline-none text-sm font-semibold text-gray-700" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
                            <input required type="text" placeholder="Venue" className="w-full px-5 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#00A884]/20 focus:border-[#00A884] transition-all outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400 placeholder:font-normal" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Registration Fee (RM)</label>
                            <input required type="text" placeholder="0.00" className="w-full px-5 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#00A884]/20 focus:border-[#00A884] transition-all outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400 placeholder:font-normal" value={newEvent.fee} onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Time</label>
                            <input required type="time" className="w-full px-5 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#00A884]/20 focus:border-[#00A884] transition-all outline-none text-sm font-semibold text-gray-700" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                        <textarea required placeholder="Event details..." className="w-full px-5 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#00A884]/20 focus:border-[#00A884] transition-all outline-none min-h-[140px] text-sm leading-relaxed text-gray-700 placeholder:text-gray-400 placeholder:font-normal resize-none" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-bottom z-30">
                    <button type="submit" disabled={isSubmitting} className="w-full max-w-3xl mx-auto bg-[#00A884] hover:bg-[#008f70] disabled:bg-[#00A884]/60 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#00A884]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} strokeWidth={2.5} />}
                        {isSubmitting ? 'Publishing...' : 'Publish Event'}
                    </button>
                </div>
            </form>
        </div>
    );

    const renderDownloads = () => (
        <div className="pb-32 bg-gray-50/50 min-h-screen animate-in slide-in-from-right duration-300">
            <div className="px-6 py-5 bg-white flex items-center justify-between sticky top-0 z-20 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
                <h2 className="font-bold text-2xl text-[#003829]">Reports</h2>
                <button onClick={handleDownloadCSV} className="bg-[#00A884] hover:bg-[#008f70] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm active:scale-95 transition-all flex items-center gap-2">
                    <Plus size={16} strokeWidth={2.5} /> Generate New
                </button>
            </div>

            <div className="p-6 max-w-2xl mx-auto space-y-4">
                {MOCK_REPORTS.map((report) => (
                    <div key={report.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#00A884]">
                                <FileSpreadsheet size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{report.title} - {report.date}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Generated: {report.date}, {report.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleDownloadCSV} className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <Download size={14} /> Download CSV
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 max-w-7xl mx-auto relative flex flex-col shadow-2xl">
            <div className="flex-1 overflow-y-auto hide-scrollbar">
                {activeTab === 'home' && renderDashboard()}
                {activeTab === 'create' && renderCreateEvent()}
                {activeTab === 'downloads' && renderDownloads()}
            </div>

            {/* Bottom Navigation */}
            {activeTab !== 'create' && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-[80px] max-w-7xl mx-auto z-20 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
                    <div className="relative flex justify-around items-center h-full px-6">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center gap-1.5 transition-colors w-16 ${activeTab === 'home' ? 'text-[#00A884]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <div className={`p-1 rounded-lg transition-all ${activeTab === 'home' ? '-translate-y-1' : ''}`}>
                                <Calendar size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-bold tracking-wide">Events</span>
                        </button>

                        {/* Floating Action Button */}
                        <div className="relative -top-8">
                            <button
                                onClick={() => setActiveTab('create')}
                                className="bg-[#00A884] hover:bg-[#008f70] text-white w-16 h-16 rounded-full shadow-[0_8px_20px_-4px_rgba(0,168,132,0.4)] flex items-center justify-center active:scale-95 transition-all border-[6px] border-white"
                            >
                                <Plus size={32} strokeWidth={3} />
                            </button>
                        </div>

                        <button
                            onClick={() => setActiveTab('downloads')}
                            className={`flex flex-col items-center gap-1.5 transition-colors w-16 ${activeTab === 'downloads' ? 'text-[#00A884]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <div className={`p-1 rounded-lg transition-all ${activeTab === 'downloads' ? '-translate-y-1' : ''}`}>
                                <FileSpreadsheet size={24} strokeWidth={activeTab === 'downloads' ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-bold tracking-wide">Reports</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;