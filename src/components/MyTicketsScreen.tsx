import { ArrowLeft, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { TicketCard } from './TicketCard';
import { Button } from './ui/button';

interface MyTicketsScreenProps {
    onNavigate: (screen: string) => void;
}

export function MyTicketsScreen({ onNavigate }: MyTicketsScreenProps) {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchTickets();
        }
    }, [user]);

    const fetchTickets = async () => {
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select(`
          *,
          events (
            title,
            date,
            location
          )
        `)
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTickets(data || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
            {/* Header */}
            <header className="bg-[#0A402F] px-4 py-4 flex items-center shadow-sm sticky top-0 z-10">
                <button onClick={() => onNavigate('profile')} className="text-[#FEFDF5] mr-4">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-[#FEFDF5] font-['Lora'] text-lg">My Tickets</h2>
            </header>

            {/* Content */}
            <main className="flex-1 px-4 py-6 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A402F]"></div>
                    </div>
                ) : tickets.length > 0 ? (
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <Ticket size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No tickets yet</h3>
                        <p className="text-gray-500 mb-6 max-w-xs">
                            You haven't purchased any event tickets yet. Explore upcoming events!
                        </p>
                        <Button
                            onClick={() => onNavigate('events')}
                            className="bg-[#0A402F] text-white"
                        >
                            Browse Events
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
