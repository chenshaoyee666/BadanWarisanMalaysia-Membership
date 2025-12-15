import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string, phoneNumber: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: { full_name?: string; phone_number?: string }) => Promise<{ error: AuthError | null }>;
  updateAddress: (address: { address_line1: string; address_line2?: string; postcode: string; city: string; state: string }) => Promise<{ error: AuthError | null }>;
  isAddressComplete: () => boolean;
  sendPhoneOTP: (phoneNumber: string) => Promise<{ error: AuthError | null }>;
  verifyPhoneOTP: (phoneNumber: string, token: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured. Please set up your .env file.' } as AuthError };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string, phoneNumber: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured. Please set up your .env file.' } as AuthError };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone_number: phoneNumber,
        },
      },
    });
    return { error };
  };

  const updateProfile = async (updates: { full_name?: string; phone_number?: string }) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured. Please set up your .env file.' } as AuthError };
    }

    if (!user) {
      return { error: { message: 'User is not authenticated. Please sign in again.' } as AuthError };
    }

    try {
      const mergedMetadata = {
        ...user.user_metadata,
        ...updates,
      };

      const { data, error } = await supabase.auth.updateUser({
        data: mergedMetadata,
      });

      if (error) {
        console.error('Supabase updateUser error:', error);
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setUser(session.user);
        }
      }

      return { error: null };
    } catch (err) {
      console.error('updateProfile exception:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      return { error: { message: errorMessage } as AuthError };
    }
  };

  const updateAddress = async (address: { address_line1: string; address_line2?: string; postcode: string; city: string; state: string }) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured. Please set up your .env file.' } as AuthError };
    }

    if (!user) {
      return { error: { message: 'User is not authenticated. Please sign in again.' } as AuthError };
    }
    
    try {
      const { data: latestUserData } = await supabase.auth.getUser();
      const metadataSource = latestUserData.user?.user_metadata || user.user_metadata || {};
      
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...metadataSource,
          address_line1: address.address_line1,
          address_line2: address.address_line2,
          postcode: address.postcode,
          city: address.city,
          state: address.state,
          address_complete: true,
        },
      });
      
      if (error) {
        console.error('Supabase updateUser error:', error);
        return { error };
      }
      
      // Refresh user data after update
      if (data.user) {
        setUser(data.user);
        // Also refresh session to ensure all data is up to date
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setUser(session.user);
        }
      }
      
      return { error: null };
    } catch (err) {
      console.error('updateAddress exception:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update address';
      return { error: { message: errorMessage } as AuthError };
    }
  };

  const isAddressComplete = () => {
    if (!user?.user_metadata) return false;
    const metadata = user.user_metadata;
    return !!(
      metadata.address_line1 &&
      metadata.postcode &&
      metadata.city &&
      metadata.state
    );
  };

  const sendPhoneOTP = async (phoneNumber: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured. Please set up your .env file.' } as AuthError };
    }
    
    // Send OTP via Supabase phone auth (uses Twilio if configured)
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
    
    return { error };
  };

  const verifyPhoneOTP = async (phoneNumber: string, token: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured. Please set up your .env file.' } as AuthError };
    }
    
    const currentUser = user;
    const isProfileUpdate = !!currentUser;
    const currentUserId = currentUser?.id;
    
    // Save all existing metadata before verification (to preserve user details)
    // This includes: full_name, email, address_line1, address_line2, postcode, city, state, etc.
    const existingMetadata = currentUser?.user_metadata || {};
    
    // Verify OTP
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: token,
      type: 'sms',
    });
    
    if (error) {
      return { error };
    }
    
    // After verification, restore ALL user metadata and add phone_verified
    // This ensures full_name, email, address, and all other details are preserved
    // Note: email is stored in user.email (not user_metadata), so it's automatically preserved
    const updatedMetadata: Record<string, any> = {
      ...existingMetadata,
      phone_number: phoneNumber,
      phone_verified: true,
      // Ensure email is also in metadata as backup (though it's primarily in user.email)
      email: currentUser?.email || data.user?.email || existingMetadata.email,
    };
    
    // If this was a profile update, increment phone change count
    if (isProfileUpdate && currentUserId) {
      updatedMetadata.phone_change_count = (existingMetadata.phone_change_count || 0) + 1;
    }
    
    // Update user with all preserved metadata plus phone verification
    const { error: updateError } = await supabase.auth.updateUser({
      data: updatedMetadata,
    });
    
    if (updateError) {
      console.error('Error updating user metadata after phone verification:', updateError);
      return { error: updateError };
    }
    
    // Refresh session to get updated user data with all details including email
    // Get fresh user data to ensure email is properly loaded
    const { data: { user: freshUser } } = await supabase.auth.getUser();
    if (freshUser) {
      setUser(freshUser);
      // Also update session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
      }
    } else if (data.session) {
      // Fallback: use the session from verifyOtp response
      setSession(data.session);
      setUser(data.session.user);
    }
    
    return { error: null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isConfigured: isSupabaseConfigured, signIn, signUp, updateProfile, updateAddress, isAddressComplete, sendPhoneOTP, verifyPhoneOTP, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

