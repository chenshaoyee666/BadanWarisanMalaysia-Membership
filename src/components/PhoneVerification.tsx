import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Props {
  phoneNumber: string;
  onVerificationSuccess?: () => void;
}

export default function PhoneVerification({ phoneNumber, onVerificationSuccess }: Props) {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendCode = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });
      if (error) throw error;
      setMessage('Verification code sent!');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: verificationCode,
        type: 'sms',
      });
      if (error) throw error;
      setMessage('Phone verified successfully!');
      onVerificationSuccess?.();
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter 6-digit verification code"
          className="w-full p-2 border rounded"
          maxLength={6}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSendCode}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Send Code
          </button>
          <button
            onClick={handleVerifyCode}
            disabled={loading || verificationCode.length !== 6}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Verify Code
          </button>
        </div>
      </div>
      {message && (
        <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
