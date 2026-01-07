import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, User } from 'lucide-react';

export interface EventRegistrationData {
    id: string;
    event_id: string;
    user_id: string;
    event_title: string;
    event_date: string;
    event_location: string;
    event_image_url?: string;
    registrant_name: string;
    registrant_email: string;
    status: string;
    created_at?: string;
}

export interface RegistrationTicketCardProps {
    registration: EventRegistrationData;
    className?: string;
}

export function RegistrationTicketCard({ registration, className = "" }: RegistrationTicketCardProps) {
    const eventDate = registration.event_date ? new Date(registration.event_date) : null;

    // Generate simplified QR code data for admin validation
    // Keep it minimal for better QR code readability
    const qrData = JSON.stringify({
        type: 'event_registration',
        registration_id: registration.id
    });

    // Determine status badge styling
    const getStatusBadge = () => {
        switch (registration.status) {
            case 'attended':
                return { bg: 'bg-green-100', text: 'text-green-700', label: 'Attended' };
            case 'cancelled':
                return { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' };
            default:
                return { bg: 'bg-[#0A402F]', text: 'text-white', label: 'Registered' };
        }
    };

    const statusBadge = getStatusBadge();

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
            {/* Ticket Header with Event Image */}
            {registration.event_image_url && (
                <div className="relative h-32 overflow-hidden">
                    <img
                        src={registration.event_image_url}
                        alt={registration.event_title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h4 className="font-['Lora'] text-white font-bold text-lg leading-tight">
                            {registration.event_title}
                        </h4>
                    </div>
                </div>
            )}

            {/* Ticket Body */}
            <div className="p-4">
                {/* Event Title (shown if no image) */}
                {!registration.event_image_url && (
                    <h4 className="font-['Lora'] text-[#0A402F] font-bold text-lg mb-3">
                        {registration.event_title}
                    </h4>
                )}

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                    {eventDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={14} className="text-[#0A402F]" />
                            <span>{eventDate.toLocaleDateString('en-MY', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-[#0A402F]" />
                        <span className="truncate">{registration.event_location || 'Location TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={14} className="text-[#0A402F]" />
                        <span>{registration.registrant_name}</span>
                    </div>
                </div>

                {/* Dashed Divider */}
                <div className="border-t-2 border-dashed border-gray-200 my-4 relative">
                    <div className="absolute -left-6 -top-3 w-6 h-6 bg-[#FEFDF5] rounded-full" />
                    <div className="absolute -right-6 -top-3 w-6 h-6 bg-[#FEFDF5] rounded-full" />
                </div>

                {/* QR Code Section */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Ticket ID</p>
                        <p className="font-mono text-sm text-gray-700">{registration.id.slice(0, 8).toUpperCase()}</p>
                        <div className={`inline-block mt-2 px-2 py-1 rounded-lg text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.label}
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border-2 border-gray-200">
                        <QRCodeSVG
                            value={qrData}
                            size={140}
                            fgColor="#000000"
                            bgColor="#FFFFFF"
                            level="M"
                            includeMargin={true}
                        />
                    </div>
                </div>

                {/* Instructions */}
                <p className="text-xs text-gray-400 text-center mt-4">
                    Present this QR code to the event staff for check-in
                </p>
            </div>
        </div>
    );
}
