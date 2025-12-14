import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import bwmLogo from '../assets/BWM logo.png';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
  onLogin?: () => void;
  onLoginSuccess?: () => void;
}

export function LoginScreen({ onNavigate, onLogin, onLoginSuccess }: LoginScreenProps) {
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
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

    setIsLoading(true);
    
    try {
      const { error } = await signIn(trimmedEmail, password);
      
      if (error) {
        // Provide more user-friendly error messages
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.message.includes('email')) {
          errorMessage = 'Email error: ' + error.message;
        }
        setError(errorMessage);
        setIsLoading(false);
      } else {
        // Success - notify parent that login was successful
        if (onLogin) {
          onLogin();
        }
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        // Don't navigate directly - let App.tsx handle it based on address completion
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* Header with Logo */}
      <div className="bg-[#0A402F] px-6 py-8 flex flex-col items-center justify-center">
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
          {/* Configuration Warning */}
          {!isConfigured && (
            <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <h3 className="text-yellow-800 font-semibold mb-2">⚠️ Supabase Not Configured</h3>
              <p className="text-yellow-700 text-sm mb-3">
                To enable authentication, please set up your Supabase credentials:
              </p>
              <ol className="text-yellow-700 text-sm list-decimal list-inside space-y-1">
                <li>Create a <code className="bg-yellow-100 px-1 rounded">.env</code> file in the root directory</li>
                <li>Add your Supabase URL and anon key</li>
                <li>Restart the development server</li>
              </ol>
              <p className="text-yellow-700 text-xs mt-3">
                See <code className="bg-yellow-100 px-1 rounded">SUPABASE_SETUP.md</code> for detailed instructions.
              </p>
            </div>
          )}

          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <h2 className="text-[#333333] font-['Lora'] text-3xl font-semibold mb-2">
              Welcome Back
            </h2>
            <p className="text-[#333333] opacity-70 text-sm">
              Sign in to continue your heritage journey
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {/* Handle forgot password */}}
                className="text-sm text-[#0A402F] hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] font-medium text-base shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#FFFBEA] border-t-transparent rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#0A402F]/20"></div>
            <span className="text-[#333333] opacity-60 text-sm">or</span>
            <div className="flex-1 h-px bg-[#0A402F]/20"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-[#333333] opacity-70 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="text-[#0A402F] font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-[#333333] opacity-60 text-xs">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </footer>
    </div>
  );
}