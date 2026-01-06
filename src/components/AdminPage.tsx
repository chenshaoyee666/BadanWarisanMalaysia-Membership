// src/components/AdminPage.tsx
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
    FileText,
    Loader2,
    Trash2,
    AlignLeft,
    DollarSign
} from 'lucide-react';
import { generateAndSaveReport, downloadReportFromStorage, deleteReport } from '../services/csv_file_logic';
import { supabase } from '../lib/admin-supabase-client.';

// --- Types ---
interface Event {
    id: number;
    created_at?: string;
    event_title: string;
    description: string;
    date: string;
    location: string;
    image_url?: string;
    fee?: string;
    member_fee?: string;
    time: string;
}

interface AdminPageProps {
    onNavigate: (screen: string) => void;
}

const AdminPage = ({ onNavigate }: AdminPageProps) => {
    const [activeTab, setActiveTab] = useState<'home' | 'create' | 'downloads'>('home');
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
        fee: '',
        member_fee: '',
        time: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // --- Supabase Logic ---
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
            await fetchReportHistory();
        } catch (error: any) {
            alert(`Failed: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteReport = async (id: string, filePath: string) => {
        if (!window.confirm('Delete this report?')) return;
        try {
            await deleteReport(id, filePath);
            await fetchReportHistory();
        } catch (error: any) {
            alert(`Failed: ${error.message}`);
        }
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("File selected:", file.name); // Debug log
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let publicImageUrl = '';
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                // 1. Upload
                const { error: uploadError } = await supabase.storage.from('event_poster').upload(filePath, imageFile);
                if (uploadError) throw uploadError;

                // 2. Get URL
                const { data } = supabase.storage.from('event_poster').getPublicUrl(filePath);
                publicImageUrl = data.publicUrl;
            }

            // 3. Insert Data
            const { error: dbError } = await supabase.from('admin_event_post').insert([{
                event_title: newEvent.event_title,
                fee: newEvent.fee,
                member_fee: newEvent.member_fee,
                description: newEvent.description,
                date: newEvent.date,
                time: newEvent.time,
                location: newEvent.location,
                image_url: publicImageUrl
            }]);

            if (dbError) throw dbError;

            // Reset
            setNewEvent({ event_title: '', date: '', location: '', description: '', image_url: '', fee: '', time: '' });
            setImagePreview(null);
            setImageFile(null);
            await fetchEvents();
            setActiveTab('home');
        } catch (error: any) {
            console.error(error);
            alert(`Error: ${error.message || "Unknown error"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEvent = async (id: number) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            const { error } = await supabase.from('admin_event_post').delete().eq('id', id);
            if (error) throw error;
            await fetchEvents();
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };

    // --- Views ---

    const renderDashboard = () => (
        <div className="pb-32 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="px-5 py-6 bg-[#0A402F] sticky top-0 z-10 shadow-md">
                <div className="relative flex items-center justify-center">
                    <button
                        onClick={() => onNavigate('profile')}
                        className="absolute left-0 text-[#FFFBEA] hover:text-white transition-colors"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#FFFBEA] font-['Lora'] tracking-wide">My Events</h1>
                        <p className="text-[10px] text-[#FFFBEA] font-medium uppercase tracking-wider mt-0.5">
                            {isLoading ? '...' : `${events.length} Active`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-8">
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
                        <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="h-40 w-full bg-gray-100 relative">
                                {event.image_url ? (
                                    <img src={event.image_url} alt={event.event_title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#0A402F]/5 text-[#0A402F]/30">
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-[#333333] text-xl leading-tight font-['Lora']">{event.event_title}</h3>
                                    <button className="text-gray-400 p-1"><MoreVertical size={16} /></button>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                    <div className="flex items-center gap-1.5"><Calendar size={14} className="text-[#0A402F]" /><span>{event.date} • {event.time || 'Time N/A'}</span></div>
                                    <div className="flex items-center gap-1.5 truncate max-w-[120px]"><MapPin size={14} className="text-[#0A402F]" /><span className="truncate">{event.location}</span></div>
                                </div>
                                {event.fee !== undefined && (
                                    <div className="mb-4 bg-[#FFFBEA] px-4 py-3 rounded-xl border border-[#0A402F]/5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-[#0A402F] uppercase tracking-wide">Registration Fee</span>
                                            <span className="text-base font-bold text-[#0A402F]">RM {parseFloat(event.fee || '0').toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                                {event.member_fee !== undefined && (
                                    <div className="mb-4 bg-[#FFFBEA] px-4 py-3 rounded-xl border border-[#0A402F]/5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-[#0A402F] uppercase tracking-wide">Member Fee</ span>
                                            <span className="text-base font-bold text-[#0A402F]">RM {parseFloat(event.member_fee || '0').toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="text-sm text-gray-500 mb-2">Notes: </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed font-['Inter']">{event.description}</p>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <div className="flex flex-col"><span className="text-[#0A402F] font-bold text-lg leading-none">0</span><span className="text-gray-400 text-[10px] font-medium uppercase">Registered</span></div>
                                    <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderCreateEvent = () => (
        <div className="bg-[#FFFBEA] min-h-screen pb-32 animate-in slide-in-from-right duration-300">
            <div className="px-5 py-6 bg-[#0A402F] sticky top-0 z-10 shadow-md">
                <div className="relative flex items-center justify-center">
                    <button
                        onClick={() => setActiveTab('home')}
                        className="absolute left-0 text-[#FFFBEA] hover:text-white transition-colors"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <h2 className="text-2xl font-bold text-[#FFFBEA] font-['Lora'] tracking-wide">Create New Event</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-6">

                {/* FIX 1: Explicit Height for Upload Box */}
                <br />
                <div className="w-full">
                    <label className="block text-xl font-bold text-[#000000] uppercase mb-2 tracking-widest text-center">Event Poster</label>
                    <div
                        className="w-full rounded-2xl border-2 border-dashed border-[#0A402F]/20 bg-white hover:border-[#0A402F]/50 transition-colors relative overflow-hidden group shadow-sm flex flex-col items-center justify-center"
                        style={{ height: '240px' }}
                    >
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/80 transition-colors z-10"><X size={18} /></button>
                            </>
                        ) : (
                            <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-4">
                                <div className="bg-[#0A402F]/5 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="text-[#0A402F]" size={50} />
                                </div>
                                <span className="text-sm font-bold text-[#333333]">Tap to upload image</span>
                                <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                            </label>
                        )}
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="text-center block text-xl font-bold text-[#0A402F] uppercase mb-2 tracking-widest pl-1">Event Title</label>
                        <input required type="text" placeholder="e.g. Annual Heritage Gala" className="w-full px-4 py-7 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A402F]/20 focus:border-[#0A402F] transition-all text-[#333333] font-bold text-2xl text-center" value={newEvent.event_title} onChange={e => setNewEvent({ ...newEvent, event_title: e.target.value })} />
                    </div>

                    <br />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xl font-bold text-[#0A402F] uppercase mb-2 tracking-widest pl-1 text-center">Date</label>
                            <input required type="date" className="w-full px-4 py-5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A402F]/20 focus:border-[#0A402F] transition-all text-[#333333] font-medium text-lg text-center" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xl font-bold text-[#0A402F] uppercase mb-2 tracking-widest pl-1 text-center">Time</label>
                            <input required type="time" className="w-full px-4 py-5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A402F]/20 focus:border-[#0A402F] transition-all text-[#333333] font-medium text-lg text-center" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xl text-center font-bold text-[#0A402F] uppercase mb-2 tracking-widest pl-1">Location</label>
                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><MapPin size={18} /></div>
                            <input required type="text" placeholder="Venue" className="w-full pl-10 pr-4 py-5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A402F]/20 focus:border-[#0A402F] transition-all text-[#333333] font-medium text-lg text-center" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                        </div>
                    </div>

                    <br />
                    <div>
                        <label className="block text-center text-xl font-bold text-[#0A402F] uppercase mb-2 tracking-widest pl-1">Registration Fee (RM)</label>
                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><DollarSign size={18} /></div>
                            <input required type="number" step="0.01" placeholder="0.00" className="w-full pl-10 pr-4 py-5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A402F]/20 focus:border-[#0A402F] transition-all text-[#333333] font-medium text-lg text-center" value={newEvent.fee} onChange={e => setNewEvent({ ...newEvent, fee: e.target.value })} />
                        </div>
                    </div>

                    <br />
                    <div>
                        <label className="block text-center text-xl font-bold text-[#0A402F] uppercase mb-2 tracking-widest pl-1">Member Fee (RM)</label>
                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><DollarSign size={18} /></div>
                            <input required type="number" step="0.01" placeholder="0.00" className="w-full pl-10 pr-4 py-5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A402F]/20 focus:border-[#0A402F] transition-all text-[#333333] font-medium text-lg text-center" value={newEvent.member_fee} onChange={e => setNewEvent({ ...newEvent, member_fee: e.target.value })} />
                        </div>
                    </div>

                    <br />
                    <div>
                        <label className="block text-xl text-center font-bold text-[#0A402F] uppercase mb-2 tracking-widest pl-1">Description</label>
                        <div className="relative">
                            <div className="absolute left-3.5 top-4 text-gray-400 pointer-events-none"><AlignLeft size={18} /></div>
                            <textarea required placeholder="Enter full event details..." className="text-center w-full pl-10 pr-4 py-5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A402F]/20 focus:border-[#0A402F] transition-all text-[#333333] min-h-[140px] leading-relaxed resize-none text-lg font-medium" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* FIX 2: Constrain Button Width on Desktop with max-w-md mx-auto */}
                <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#FFFBEA]/80 backdrop-blur-md border-t border-[#0A402F]/5 z-30 max-w-md mx-auto">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#0A402F] text-[#FFFBEA] font-bold py-4 rounded-xl shadow-lg shadow-[#0A402F]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                        {isSubmitting ? 'Publishing Event...' : 'Publish Event'}
                    </button>
                </div>
            </form>
        </div>
    );

    const renderDownloads = () => (
        <div className="bg-[#FFFBEA] min-h-screen pb-24 animate-in slide-in-from-right duration-300">
            <div className="px-5 py-6 bg-[#0A402F] sticky top-0 z-10 shadow-md">
                <div className="relative flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-[#FFFBEA] font-['Lora'] tracking-wide">Reports</h2>
                    <button
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className="absolute right-4 bg-[#FFFBEA] text-[#0A402F] text-xs font-bold px-4 py-2 rounded-lg shadow-sm active:scale-95 transition-all hover:bg-white"
                    >
                        {isGenerating ? '...' : '+ New'}
                    </button>
                </div>
            </div>
            <div className="p-5 space-y-3">
                {reportHistory.length === 0 ? <p className="text-center text-gray-400 text-sm py-10 italic">No reports generated yet.</p> : reportHistory.map(r => (
                    <div key={r.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                        <div><h3 className="font-bold text-sm text-[#333333]">{r.file_name}</h3><p className="text-xs text-gray-500 mt-0.5">{new Date(r.created_at).toLocaleDateString()}</p></div>
                        <div className="flex gap-2">
                            <button onClick={() => downloadReportFromStorage(r.file_path, r.file_name)} className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"><Download size={16} /></button>
                            <button onClick={() => handleDeleteReport(r.id, r.file_path)} className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        // FIX 3: Add 'max-w-md mx-auto relative' to the main container
        <div className="min-h-screen bg-[#FFFBEA] font-sans text-gray-900 mx-auto shadow-2xl relative max-w-md overflow-hidden">
            <div className="h-full overflow-y-auto hide-scrollbar">
                {activeTab === 'home' && renderDashboard()}
                {activeTab === 'create' && renderCreateEvent()}
                {activeTab === 'downloads' && renderDownloads()}
            </div>

            {activeTab !== 'create' && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-end px-2 pb-2 pt-2 max-w-md mx-auto z-40 h-[80px]">
                    <button onClick={() => setActiveTab('home')} className={`group flex-1 flex flex-col items-center pb-3 transition-all duration-300 ${activeTab === 'home' ? 'text-[#0A402F]' : 'text-gray-400 hover:text-gray-600'}`}>
                        <div className={`p-2 rounded-2xl mb-1 transition-all duration-300 ${activeTab === 'home' ? 'bg-[#0A402F]/10 scale-110' : 'group-hover:bg-gray-50'}`}>
                            <Calendar size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                        </div>
                        <span className={`text-[11px] tracking-wide transition-all ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>Events</span>
                    </button>
                    <div className="relative -top-8">
                        <button onClick={() => setActiveTab('create')} className="bg-[#0A402F] text-[#FFFBEA] w-16 h-16 rounded-full shadow-2xl shadow-[#0A402F]/40 flex items-center justify-center active:scale-95 hover:scale-105 transition-all border-[6px] border-white">
                            <Plus size={32} strokeWidth={3} />
                        </button>
                    </div>
                    <button onClick={() => setActiveTab('downloads')} className={`group flex-1 flex flex-col items-center pb-3 transition-all duration-300 ${activeTab === 'downloads' ? 'text-[#0A402F]' : 'text-gray-400 hover:text-gray-600'}`}>
                        <div className={`p-2 rounded-2xl mb-1 transition-all duration-300 ${activeTab === 'downloads' ? 'bg-[#0A402F]/10 scale-110' : 'group-hover:bg-gray-50'}`}>
                            <Download size={22} strokeWidth={activeTab === 'downloads' ? 2.5 : 2} />
                        </div>
                        <span className={`text-[11px] tracking-wide transition-all ${activeTab === 'downloads' ? 'font-bold' : 'font-medium'}`}>Reports</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminPage;