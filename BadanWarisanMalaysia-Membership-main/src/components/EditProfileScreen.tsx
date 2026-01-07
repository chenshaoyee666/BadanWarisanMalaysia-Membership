import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

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

interface EditProfileScreenProps {
  onNavigate: (screen: string, phone?: string, isSignUp?: boolean) => void;
}

export function EditProfileScreen({ onNavigate }: EditProfileScreenProps) {
  const { user, updateProfile, updateAddress } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const refreshUserData = async () => {
      if (user) {
        // Always use the actual user.email, not a fallback
        setFullName(user.user_metadata?.full_name || '');
        setEmail(user.email || '');
        setPhoneNumber(user.user_metadata?.phone_number || '');
        
        // Load address data
        setAddressLine1(user.user_metadata?.address_line1 || '');
        setAddressLine2(user.user_metadata?.address_line2 || '');
        setPostcode(user.user_metadata?.postcode || '');
        setCity(user.user_metadata?.city || '');
        setState(user.user_metadata?.state || '');
      } else {
        // If user is not available, try to refresh from session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setFullName(session.user.user_metadata?.full_name || '');
          setEmail(session.user.email || '');
          setPhoneNumber(session.user.user_metadata?.phone_number || '');
          setAddressLine1(session.user.user_metadata?.address_line1 || '');
          setAddressLine2(session.user.user_metadata?.address_line2 || '');
          setPostcode(session.user.user_metadata?.postcode || '');
          setCity(session.user.user_metadata?.city || '');
          setState(session.user.user_metadata?.state || '');
        }
      }
    };
    
    refreshUserData();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    // Phone number is read-only - update name and address only
    setIsLoading(true);

    try {
      // Update profile (name)
      const { error: profileError } = await updateProfile({
        full_name: fullName.trim(),
      });

      if (profileError) {
        setError(profileError.message);
        setIsLoading(false);
        return;
      }

      // Update address if any address fields are filled
      const hasAddressData = addressLine1.trim() || postcode.trim() || city.trim() || state;
      
      if (hasAddressData) {
        // Validate required address fields
        if (!addressLine1.trim()) {
          setError('Address Line 1 is required');
          setIsLoading(false);
          return;
        }

        if (!postcode.trim()) {
          setError('Postcode is required');
          setIsLoading(false);
          return;
        }

        // Validate postcode format (5 digits)
        const postcodeRegex = /^\d{5}$/;
        if (!postcodeRegex.test(postcode.trim())) {
          setError('Postcode must be 5 digits');
          setIsLoading(false);
          return;
        }

        if (!city.trim()) {
          setError('City is required');
          setIsLoading(false);
          return;
        }

        if (!state) {
          setError('State is required');
          setIsLoading(false);
          return;
        }

        // Update address
        const { error: addressError } = await updateAddress({
          address_line1: addressLine1.trim(),
          address_line2: addressLine2.trim() || undefined,
          postcode: postcode.trim(),
          city: city.trim(),
          state: state,
        });

        if (addressError) {
          setError(addressError.message || 'Failed to update address');
          setIsLoading(false);
          return;
        }
      }

      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        onNavigate('profile');
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* SUB-PAGE: Simple Header with Back Button */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center gap-4">
        <button onClick={() => onNavigate('profile')} className="text-[#FFFBEA]">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[#FFFBEA] font-['Lora'] flex-1 text-center mr-6">Edit Profile</h2>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-[#333333] font-['Inter']">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-white border-[#0A402F]/20 rounded-xl font-['Inter'] h-12 focus:border-[#0A402F] focus:ring-[#0A402F]/20"
            />
          </div>

          {/* Email Address (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#333333] font-['Inter']">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-gray-100 border-gray-300 rounded-xl font-['Inter'] h-12 opacity-70 cursor-not-allowed"
            />
            <p className="text-xs text-[#333333] opacity-60">Email cannot be changed</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#333333] font-['Inter']">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              disabled={true}
              className="bg-gray-100 border-gray-300 rounded-xl font-['Inter'] h-12 opacity-70 cursor-not-allowed"
            />
            <p className="text-xs text-[#333333] opacity-60">
              Phone number cannot be changed. Please contact support if you need to update it.
            </p>
          </div>

          {/* Address Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-[#333333] font-['Inter'] font-semibold mb-4">Address Information</h3>
            
            {/* Address Line 1 */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="addressLine1" className="text-[#333333] font-['Inter']">
                Address Line 1 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="addressLine1"
                type="text"
                placeholder="e.g., 123 Jalan Merdeka"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="bg-white border-[#0A402F]/20 rounded-xl font-['Inter'] h-12 focus:border-[#0A402F] focus:ring-[#0A402F]/20"
              />
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="addressLine2" className="text-[#333333] font-['Inter']">
                Address Line 2
              </Label>
              <Input
                id="addressLine2"
                type="text"
                placeholder="e.g., Taman Desa"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="bg-white border-[#0A402F]/20 rounded-xl font-['Inter'] h-12 focus:border-[#0A402F] focus:ring-[#0A402F]/20"
              />
            </div>

            {/* Postcode */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="postcode" className="text-[#333333] font-['Inter']">
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
                maxLength={5}
                className="bg-white border-[#0A402F]/20 rounded-xl font-['Inter'] h-12 focus:border-[#0A402F] focus:ring-[#0A402F]/20"
              />
            </div>

            {/* City */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="city" className="text-[#333333] font-['Inter']">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="e.g., Kuala Lumpur"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-white border-[#0A402F]/20 rounded-xl font-['Inter'] h-12 focus:border-[#0A402F] focus:ring-[#0A402F]/20"
              />
            </div>

            {/* State */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="state" className="text-[#333333] font-['Inter']">
                State <span className="text-red-500">*</span>
              </Label>
              <Select value={state} onValueChange={setState}>
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
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              Profile updated successfully! Redirecting...
            </div>
          )}

          {/* Save Changes Button */}
          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] h-12 rounded-xl font-['Inter'] mt-4"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#FFFBEA] border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
