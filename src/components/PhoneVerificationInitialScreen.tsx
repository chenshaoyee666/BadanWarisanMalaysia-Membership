import React, { useState } from 'react';
import { Phone, Pencil, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';

interface PhoneVerificationInitialScreenProps {
  onNavigate: (screen: string, phone?: string, isSignUp?: boolean) => void;
  phoneNumber: string;
  isSignUp?: boolean;
}

export function PhoneVerificationInitialScreen({ 
  onNavigate, 
  phoneNumber: initialPhoneNumber,
  isSignUp = false 
}: PhoneVerificationInitialScreenProps) {
  const { sendPhoneOTP, updateProfile, user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhone, setEditedPhone] = useState(initialPhoneNumber);
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasEditedPhone, setHasEditedPhone] = useState(false);

  const handleEditPhone = () => {
    if (hasEditedPhone) {
      setError('You can only edit your phone number once. Please contact support if you need to change it again.');
      return;
    }
    setIsEditing(true);
    setEditedPhone(phoneNumber);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPhone(phoneNumber);
    setError(null);
  };

  const handleSavePhone = async () => {
    if (!editedPhone.trim()) {
      setError('Phone number is required');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(editedPhone.trim()) || editedPhone.trim().length < 8) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { error: updateError } = await updateProfile({
        phone_number: editedPhone.trim(),
      });

      if (updateError) {
        setError(updateError.message || 'Failed to update phone number. Please try again.');
        setIsSaving(false);
      } else {
        setPhoneNumber(editedPhone.trim());
        setIsEditing(false);
        setHasEditedPhone(true);
        setIsSaving(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSaving(false);
    }
  };

  const handleSendCode = async () => {
    setIsSending(true);
    setError(null);
    
    try {
      const { error } = await sendPhoneOTP(phoneNumber);
      
      if (error) {
        setError(error.message || 'Failed to send verification code. Please try again.');
        setIsSending(false);
      } else {
        // Successfully sent, navigate to OTP input screen
        onNavigate('phone-verification', phoneNumber, isSignUp);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* Header with Phone Icon - exactly like the picture */}
      <header className="bg-[#0A402F] px-6 py-8 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center">
          <Phone className="text-[#FFFBEA]" size={40} strokeWidth={2} fill="none" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          {/* Title */}
          <h2 className="text-[#0A402F] font-['Lora'] text-2xl font-semibold mb-4 text-center">
            Verify Your Phone
          </h2>

          {/* Instruction Text */}
          <p className="text-[#333333] opacity-70 text-sm mb-6 text-center">
            Click the button below to send a verification code to
          </p>

          {/* Phone Number Display with Edit Icon */}
          {!isEditing ? (
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-[#0A402F] font-semibold text-lg">{phoneNumber}</p>
              {!hasEditedPhone && (
                <button
                  onClick={handleEditPhone}
                  className="text-[#333333] opacity-50 hover:opacity-70 transition-opacity"
                  title="Edit phone number"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex items-center gap-2 justify-center">
                <Input
                  type="tel"
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  className="flex-1 max-w-xs h-10 text-center border-[#0A402F]/20 focus:border-[#0A402F]"
                  placeholder="Enter phone number"
                />
                <button
                  onClick={handleSavePhone}
                  disabled={isSaving}
                  className="text-green-600 hover:text-green-700 disabled:opacity-50"
                  title="Save phone number"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  title="Cancel"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Message */}
          {hasEditedPhone && !isEditing && (
            <p className="text-[#333333] opacity-70 text-sm mb-4 text-center">
              Phone number updated! Please send a verification code to verify the new number.
            </p>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          {/* Send Verification Code Button */}
          <Button
            onClick={handleSendCode}
            disabled={isSending}
            className="w-full h-14 rounded-xl bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] font-medium text-base shadow-lg"
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#FFFBEA] border-t-transparent rounded-full animate-spin"></span>
                Sending...
              </span>
            ) : (
              'Send Verification Code'
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}

