import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

interface PhoneVerificationScreenProps {
  onNavigate: (screen: string, phone?: string, isSignUp?: boolean) => void;
  phoneNumber: string;
  onVerificationComplete: () => void;
  isSignUp?: boolean;
}

export function PhoneVerificationScreen({ 
  onNavigate, 
  phoneNumber, 
  onVerificationComplete,
  isSignUp = false 
}: PhoneVerificationScreenProps) {
  const { sendPhoneOTP, verifyPhoneOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Set countdown when component mounts (OTP was already sent from initial screen)
    setCountdown(60); // 60 second countdown
  }, []);

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    setIsSending(true);
    setError(null);
    
    try {
      const { error } = await sendPhoneOTP(phoneNumber);
      
      if (error) {
        setError(error.message || 'Failed to send verification code. Please try again.');
        setIsSending(false);
      } else {
        setCountdown(60); // 60 second countdown
        setIsSending(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await verifyPhoneOTP(phoneNumber, otp);
      
      if (error) {
        setError(error.message || 'Invalid verification code. Please try again.');
        setIsLoading(false);
      } else {
        setSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          onVerificationComplete();
        }, 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center gap-4">
        <button onClick={() => onNavigate(isSignUp ? 'signup' : 'edit-profile', undefined, false)} className="text-[#FFFBEA]">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[#FFFBEA] font-['Lora'] flex-1 text-center mr-6">Verify Phone Number</h2>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          {/* Icon and Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#0A402F] rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-[#FFFBEA]" size={40} />
            </div>
            <h2 className="text-[#333333] font-['Lora'] text-2xl font-semibold mb-2">
              Verify Your Phone
            </h2>
            <p className="text-[#333333] opacity-70 text-sm mb-1">
              We sent a verification code to
            </p>
            <p className="text-[#0A402F] font-semibold">{phoneNumber}</p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <Label className="text-[#333333] font-medium text-center block">
                Enter Verification Code
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isLoading || success}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
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
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle size={20} />
                <span>Phone number verified successfully!</span>
              </div>
            )}

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={isLoading || success || otp.length !== 6}
              className="w-full h-12 rounded-xl bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] font-medium text-base shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#FFFBEA] border-t-transparent rounded-full animate-spin"></span>
                  Verifying...
                </span>
              ) : success ? (
                'Verified!'
              ) : (
                'Verify Phone Number'
              )}
            </Button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-[#333333] opacity-70 text-sm mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={isSending || countdown > 0}
              className="text-[#0A402F] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                'Sending...'
              ) : countdown > 0 ? (
                `Resend code in ${countdown}s`
              ) : (
                'Resend Code'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

