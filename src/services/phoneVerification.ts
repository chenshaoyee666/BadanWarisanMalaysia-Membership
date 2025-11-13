import { supabase } from '../supabaseClient';

interface VerificationResult {
  success: boolean;
  message: string;
  error?: any;
}

export const sendVerificationCode = async (phoneNumber: string): Promise<VerificationResult> => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error) throw error;
    return {
      success: true,
      message: "Verification code sent successfully"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to send verification code",
      error
    };
  }
};

export const verifyPhoneNumber = async (phoneNumber: string, code: string): Promise<VerificationResult> => {
  try {
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: code,
      type: 'sms'
    });

    if (error) throw error;
    return {
      success: true,
      message: "Phone number verified successfully"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to verify code",
      error
    };
  }
};
