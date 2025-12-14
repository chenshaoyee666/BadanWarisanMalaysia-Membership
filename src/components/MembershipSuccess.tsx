import { Check, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface MembershipSuccessProps {
    onNavigate: (screen: string) => void;
}

export function MembershipSuccess({ onNavigate }: MembershipSuccessProps) {

    return (
        <div className="min-h-screen bg-[#FEFDF5] flex flex-col items-center justify-center p-4 pb-24 overflow-y-auto">

            {/* Success Animation */}
            <div className="mb-6 bg-[#0A402F]/10 p-4 rounded-full animate-in zoom-in duration-500">
                <Check size={40} className="text-[#0A402F]" />
            </div>

            {/* Success Message */}
            <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-500">
                <h2 className="text-[#333333] font-['Lora'] text-2xl mb-2 font-bold">
                    Welcome to the Family!
                </h2>
                <p className="text-[#333333] opacity-70 mb-2">
                    Here are your initial rewards.
                </p>
            </div>



            {/* Action Button */}
            <div className="w-full max-w-xs mt-10 animate-in fade-in slide-in-from-bottom-8 delay-500 duration-500">
                <Button
                    onClick={() => onNavigate('profile')}
                    className="bg-[#0A402F] hover:bg-[#0A402F]/90 text-white w-full py-6 text-lg rounded-xl shadow-lg shadow-[#0A402F]/20"
                >
                    View in Wallet <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>

        </div>
    );
}

