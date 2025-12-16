import { QRCodeSVG } from 'qrcode.react';

export interface TicketProps {
    ticket: {
        id: string;
        event_id: string;
        user_id: string;
        events?: {
            title: string;
            date: string;
            location: string;
        };
    };
    className?: string;
}

export function TicketCard({ ticket, className = "" }: TicketProps) {
    const eventDate = ticket.events?.date ? new Date(ticket.events.date) : new Date();

    return (
        <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${className}`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-['Lora'] text-[#0A402F] font-bold">{ticket.events?.title || 'Unknown Event'}</h4>
                    <p className="text-sm text-gray-500">
                        {eventDate.toLocaleDateString()} @ {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{ticket.events?.location || 'Location TBD'}</p>
                </div>
            </div>

            <div className="bg-[#FEFDF5] p-3 rounded-lg flex items-center justify-center border border-dashed border-[#B8860B]/30">
                <div className="flex flex-col items-center gap-2">
                    <QRCodeSVG
                        value={JSON.stringify({
                            type: 'ticket',
                            ticket_id: ticket.id,
                            event_id: ticket.event_id,
                            user_id: ticket.user_id
                        })}
                        size={100}
                        fgColor="#333333"
                        bgColor="transparent"
                    />
                    <span className="text-[10px] text-gray-400 font-mono">{ticket.id.slice(0, 8)}...</span>
                </div>
            </div>
        </div>
    );
}
