import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AddressCompletionScreenProps {
  onNavigate: (screen: string, phone?: string, isSignUp?: boolean) => void;
  onComplete: () => void;
  isNewUser?: boolean;
}

// Malaysia states list
const MALAYSIA_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Kuala Lumpur',
  'Labuan',
  'Malacca',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Putrajaya',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
];

export function AddressCompletionScreen({ onNavigate, onComplete, isNewUser = false }: AddressCompletionScreenProps) {
  const { updateAddress, user } = useAuth();
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!addressLine1.trim()) {
      setError('Address Line 1 is required');
      return;
    }

    if (!postcode.trim()) {
      setError('Postcode is required');
      return;
    }

    // Validate postcode format (5 digits)
    const postcodeRegex = /^\d{5}$/;
    if (!postcodeRegex.test(postcode.trim())) {
      setError('Postcode must be 5 digits');
      return;
    }

    if (!city.trim()) {
      setError('City is required');
      return;
    }

    if (!state) {
      setError('State is required');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await updateAddress({
        address_line1: addressLine1.trim(),
        address_line2: addressLine2.trim() || undefined,
        postcode: postcode.trim(),
        city: city.trim(),
        state: state,
      });

      if (error) {
        setError(error.message || 'Failed to save address. Please try again.');
        setIsLoading(false);
      } else {
        // Address saved successfully
        setSuccess(true);
        setIsLoading(false);
        
        // If new user, navigate to phone verification initial screen after address completion
        if (isNewUser) {
          const phoneNumber = user?.user_metadata?.phone_number;
          if (phoneNumber) {
            setTimeout(() => {
              onNavigate('phone-verification-initial', phoneNumber, true);
            }, 1000);
          } else {
            // Phone number not found, go to home
            console.warn('Phone number not found for new user');
            setTimeout(() => {
              onComplete();
            }, 1000);
          }
        } else {
          // Existing user, go to home
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Address update error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-center relative">
        <h2 className="text-[#FFFBEA] font-['Lora'] text-lg font-semibold">Complete Your Address</h2>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          {/* Icon and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0A402F] rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-[#FFFBEA]" size={32} />
            </div>
            <h2 className="text-[#333333] font-['Lora'] text-2xl font-semibold mb-2">
              Complete Your Address
            </h2>
            <p className="text-[#333333] opacity-70 text-sm">
              Please provide your address information to continue
            </p>
          </div>

          {/* Address Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Address Line 1 */}
            <div className="space-y-2">
              <Label htmlFor="addressLine1" className="text-[#333333] font-medium">
                Address Line 1 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="addressLine1"
                type="text"
                placeholder="e.g., 123 Jalan Merdeka"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
                className="h-12 rounded-xl bg-white border-[#0A402F]/20 text-[#333333] focus:border-[#0A402F] focus:ring-[#0A402F]/20"
              />
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
              <Label htmlFor="addressLine2" className="text-[#333333] font-medium">
                Address Line 2
              </Label>
              <Input
                id="addressLine2"
                type="text"
                placeholder="e.g., Taman Desa"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="h-12 rounded-xl bg-white border-[#0A402F]/20 text-[#333333] focus:border-[#0A402F] focus:ring-[#0A402F]/20"
              />
            </div>

            {/* Postcode */}
            <div className="space-y-2">
              <Label htmlFor="postcode" className="text-[#333333] font-medium">
                Postcode <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postcode"
                type="text"
                placeholder="e.g., 50000"
                value={postcode}
                onChange={(e) => {
                  // Only allow digits and limit to 5 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                  setPostcode(value);
                }}
                required
                maxLength={5}
                className="h-12 rounded-xl bg-white border-[#0A402F]/20 text-[#333333] focus:border-[#0A402F] focus:ring-[#0A402F]/20"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-[#333333] font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="e.g., Kuala Lumpur"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="h-12 rounded-xl bg-white border-[#0A402F]/20 text-[#333333] focus:border-[#0A402F] focus:ring-[#0A402F]/20"
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-[#333333] font-medium">
                State <span className="text-red-500">*</span>
              </Label>
              <Select value={state} onValueChange={setState} required>
                <SelectTrigger className="h-12 rounded-xl bg-white border-2 border-[#0A402F]/40 text-[#333333] focus:border-[#0A402F] focus:ring-2 focus:ring-[#0A402F]/30 font-medium shadow-sm hover:border-[#0A402F]/60 transition-colors">
                  <SelectValue placeholder="Select a state" className="text-[#333333]" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-[#0A402F]/20 shadow-lg max-h-[300px]">
                  {MALAYSIA_STATES.map((stateName) => (
                    <SelectItem 
                      key={stateName} 
                      value={stateName}
                      className="text-[#333333] hover:bg-[#0A402F]/10 focus:bg-[#0A402F]/10 cursor-pointer"
                    >
                      {stateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] font-medium text-base shadow-lg mt-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#FFFBEA] border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

