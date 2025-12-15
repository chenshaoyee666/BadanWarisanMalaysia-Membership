import { QRCodeSVG } from 'qrcode.react';

export interface MembershipCardProps {
    user: {
        fullName?: string;
        companyName?: string;
        membershipId?: string;
        id?: string;
        tier?: string;
    };
    className?: string;
}

export function MembershipCard({ user, className = "" }: MembershipCardProps) {
    const displayName = user.companyName ? user.companyName : (user.fullName || 'User');
    const subName = user.companyName ? user.fullName : null; // Show representative name if corporate
    const membershipId = user.membershipId || 'BWM-12345';
    const tier = user.tier || 'Member';

    // Color theme based on tier (Optional polish)
    const isGold = tier.toLowerCase().includes('corporate') || tier.toLowerCase().includes('life');

    return (
        <div className={`bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden ${className}`}>
            {/* Background pattern or subtle texture could go here */}

            {/* Card Header with Logo */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-12 h-12 bg-[#0A402F] rounded-lg flex items-center justify-center">
                    <span className="text-[#FEFDF5] font-['Lora'] font-bold">BWM</span>
                </div>
                <div className="text-right">
                    <span className="block text-[#B8860B] font-bold tracking-widest text-xs uppercase">BADAN WARISAN MALAYSIA</span>
                    <span className={`block font-bold text-sm ${isGold ? 'text-[#B8860B]' : 'text-[#0A402F]'}`}>
                        {tier.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Member Info */}
            <div className="mb-6 relative z-10">
                <h3 className="text-[#333333] font-['Lora'] text-xl font-bold mb-1">{displayName}</h3>
                {subName && (
                    <p className="text-[#333333] opacity-70 text-sm mb-1">{subName}</p>
                )}
                <p className="text-[#333333] opacity-70 text-sm">ID: {membershipId}</p>
                <p className="text-[#333333] opacity-70 text-sm mt-1">Valid until: Dec 31, 2025</p>
            </div>

            {/* QR Code */}
            <div className="bg-[#FEFDF5] rounded-xl p-4 flex gap-4 items-center border border-[#B48F5E]/20 relative z-10">
                <div className="bg-white p-2 rounded shadow-sm">
                    <QRCodeSVG value={JSON.stringify({ type: 'membership', id: membershipId, user: user.id })} size={80} />
                </div>
                <div className="flex-1">
                    <p className="text-[#333333] font-medium text-sm mb-1">Scan for Entry</p>
                    <p className="text-[#333333] opacity-60 text-xs">Present this card at BWM events and museums.</p>
                </div>
            </div>

            {/* Decorative Gold Bar */}
            <div className="absolute top-0 right-0 w-2 h-full bg-[#B8860B]/20" />
        </div>
    );
}
