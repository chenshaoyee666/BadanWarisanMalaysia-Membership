import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, Phone } from 'lucide-react';
import bwmLogo from 'figma:asset/0d1febf7746d940532ad6ebe58464b3c717cca4a.png';
import { useAuth } from '../contexts/AuthContext';

interface SignUpScreenProps {
  onNavigate: (screen: string, phone?: string, isSignUp?: boolean) => void;
  onSignUp?: () => void;
}

export function SignUpScreen({ onNavigate, onSignUp }: SignUpScreenProps) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Trim email to remove whitespace
    const trimmedEmail = email.trim();
    
    // Validate email format
    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate name
    if (!name.trim()) {
      setError('Full name is required');
      return;
    }

    // Validate phone number
    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) {
      setError('Phone number is required');
      return;
    }

    // Basic phone number validation (allows various formats)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(trimmedPhone) || trimmedPhone.length < 8) {
      setError('Please enter a valid phone number');
      return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signUp(trimmedEmail, password, name.trim(), trimmedPhone);
      
      if (error) {
        // Provide more user-friendly error messages
        let errorMessage = error.message;
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message.includes('invalid email')) {
          errorMessage = 'Please enter a valid email address';
        } else if (error.message.includes('email')) {
          errorMessage = 'Email error: ' + error.message;
        }
        setError(errorMessage);
        setIsLoading(false);
      } else {
        // Sign up successful - navigate directly to home (skip address completion)
        setIsLoading(false);
        setSuccess(true);
        // Navigate to home screen after successful sign up
        setTimeout(() => {
          onNavigate('home');
        }, 1000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* Header with Logo */}
      <div className="bg-[#0A402F] px-6 py-8 flex flex-col items-center justify-center relative">
        <button
          onClick={() => onNavigate('login')}
          className="absolute left-4 top-4 text-[#FFFBEA] hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={24} />
        </button>
        <img 
          src={bwmLogo} 
          alt="Badan Warisan Malaysia Logo" 
          className="w-20 h-20 rounded-2xl mb-4 bg-white p-2"
        />
        <h1 className="text-[#FFFBEA] font-['Lora'] text-2xl font-semibold text-center">
          Badan Warisan Malaysia
        </h1>
        <p className="text-[#FFFBEA]/80 text-sm mt-2 text-center">
          Preserving Malaysia's Heritage
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <h2 className="text-[#333333] font-['Lora'] text-3xl font-semibold mb-2">
              Create Account
            </h2>
            <p className="text-[#333333] opacity-70 text-sm">
              Join us in preserving Malaysia's heritage
            </p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#333333] font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A402F] opacity-60" 
                  size={20} 
                />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 h-12 rounded-xl bg-white border-[#0A402F]/20 text-[#333333] focus:border-[#0A402F] focus:ring-[#0A402F]/20"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#333333] font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A402F] opacity-60" 
                  size={20} 
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trimStart())}
                  required
                  autoComplete="email"
                  className="pl-10 h-12 rounded-xl bg-white border-[#0A402F]/20 text-[#333333] focus:border-[#0A402F] focus:ring-[#0A402F]/20"
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#333333] font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A402F] opacity-60" 
                  size={20} 
                />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  autoComplete="tel"
                  className="pl-10 h-12 rounded-xl bg-white border-[#0A402F]/20 text-[#333333] focus:border-[#0A402F] focus:ring-[#0A402F]/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#333333] font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A402F] opacity-60" 
                  size={20} 
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 pr-10 h-12 rounded-xl bg-white border-[#0A402F]/20 text-[#333333] focus:border-[#0A402F] focus:ring-[#0A402F]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0A402F] opacity-60 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-[#333333] opacity-60">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#333333] font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A402F] opacity-60" 
                  size={20} 
                />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-12 rounded-xl bg-white border-[#0A402F]/20 text-[#333333] focus:border-[#0A402F] focus:ring-[#0A402F]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0A402F] opacity-60 hover:opacity-100 transition-opacity"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
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
                Account created successfully! Redirecting...
              </div>
            )}

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] font-medium text-base shadow-lg mt-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#FFFBEA] border-t-transparent rounded-full animate-spin"></span>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#0A402F]/20"></div>
            <span className="text-[#333333] opacity-60 text-sm">or</span>
            <div className="flex-1 h-px bg-[#0A402F]/20"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-[#333333] opacity-70 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-[#0A402F] font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-[#333333] opacity-60 text-xs">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </footer>
    </div>
  );
}

