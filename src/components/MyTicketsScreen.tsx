import { ArrowLeft, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RegistrationTicketCard, EventRegistrationData } from './RegistrationTicketCard';
import { Button } from './ui/button';
import { fetchUserRegistrationsWithDetails } from '../services/eventService';

interface MyTicketsScreenProps {
    onNavigate: (screen: string) => void;
}

export function MyTicketsScreen({ onNavigate }: MyTicketsScreenProps) {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState<EventRegistrationData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchRegistrations();
        }
    }, [user]);

    const fetchRegistrations = async () => {
        try {
            const { data, error } = await fetchUserRegistrationsWithDetails(user?.id);
            if (error) throw error;
            setRegistrations(data || []);
        } catch (error) {
            console.error('Error fetching registrations:', error);
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
                ) : registrations.length > 0 ? (
                    <div className="space-y-4">
                        {registrations.map((registration) => (
                            <RegistrationTicketCard key={registration.id} registration={registration} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <Ticket size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No tickets yet</h3>
                        <p className="text-gray-500 mb-6 max-w-xs">
                            Register for events to get your tickets here. Each ticket has a QR code for check-in!
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

