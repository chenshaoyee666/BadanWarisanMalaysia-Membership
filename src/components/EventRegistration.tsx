import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  Phone,
  Clock,
  Home,
  DollarSign
} from 'lucide-react';
import { Input } from './ui/input';
import { Event, RegistrationFormData } from '../types/event';
import { registerForEvent } from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';

interface EventRegistrationProps {
  onNavigate: (screen: string) => void;
  event: Event;
}

export function EventRegistration({ onNavigate, event }: EventRegistrationProps) {
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone_number || '',
  });
  const [formErrors, setFormErrors] = useState<Partial<RegistrationFormData>>({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Calculate price
  const displayPrice = event.fee;
  const displayMemberFee = event.member_fee;

  const validateForm = (): boolean => {
    const errors: Partial<RegistrationFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]{8,}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const { error } = await registerForEvent(
      event.id,
      formData,
      user?.id,
      !!user
    );

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message || 'Registration failed. Please try again.');
    } else {
      setShowSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => onNavigate('event-details')}
          className="text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-white font-['Lora'] text-2xl flex-1 text-center mr-6" style={{ fontWeight: 700 }}>Register for Event</h2>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-24">
        {/* Event Info Card */}
        <div className="bg-white rounded-2xl px-6 py-6 mb-6 shadow-sm">
          <h3 className="text-[#333] font-['Lora'] text-4xl mb-6" style={{ fontWeight: 700 }}>{event.title}</h3>

          {/* Date */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#0A402F]/10 rounded-xl flex items-center justify-center">
              <Calendar size={22} className="text-[#0A402F]" />
            </div>
            <span className="text-[#333] font-['Inter']">{event.date}{event.time && ` @ ${event.time}`}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#0A402F]/10 rounded-xl flex items-center justify-center">
              <MapPin size={22} className="text-[#0A402F]" />
            </div>
            <span className="text-[#333] font-['Inter']">{event.location}</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl px-6 py-6 shadow-sm mb-6">
          <h4 className="text-[#333] font-['Lora'] text-xl mb-6" style={{ fontWeight: 700 }}>Your Details</h4>

          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-[#333] font-['Inter'] mb-3 text-sm font-medium">
                <User size={16} className="text-[#0A402F]" />
                Full Name <span className="text-[#d4183d]">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`h-12 rounded-xl font-['Inter'] border-gray-200 ${formErrors.name ? 'border-red-500' : ''}`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-2 font-['Inter']">{formErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 text-[#333] font-['Inter'] mb-3 text-sm font-medium">
                <Mail size={16} className="text-[#0A402F]" />
                Email Address <span className="text-[#d4183d]">*</span>
              </label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`h-12 rounded-xl font-['Inter'] border-gray-200 ${formErrors.email ? 'border-red-500' : ''}`}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-2 font-['Inter']">{formErrors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center gap-2 text-[#333] font-['Inter'] mb-3 text-sm font-medium">
                <Phone size={16} className="text-[#0A402F]" />
                Phone Number <span className="text-[#d4183d]">*</span>
              </label>
              <Input
                type="tel"
                placeholder="+60123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`h-12 rounded-xl font-['Inter'] border-gray-200 ${formErrors.phone ? 'border-red-500' : ''}`}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-2 font-['Inter']">{formErrors.phone}</p>
              )}
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-['Inter']">{submitError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#0A402F] hover:bg-[#083525] disabled:opacity-60 text-white h-12 rounded-xl font-['Inter'] font-medium text-base flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Confirm Registration
            </>
          )}
        </button>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <button
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Home size={24} />
            <span className="text-xs font-['Inter']">Home</span>
          </button>

          <button
            onClick={() => onNavigate('donate')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <DollarSign size={24} />
            <span className="text-xs font-['Inter']">Donate</span>
          </button>

          <button
            onClick={() => onNavigate('events')}
            className="flex flex-col items-center gap-1 text-[#0A402F]"
          >
            <Calendar size={24} />
            <span className="text-xs font-['Inter']">Events</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <User size={24} />
            <span className="text-xs font-['Inter']">Profile</span>
          </button>
        </div>
      </nav>

      {/* Success Modal */}
      {showSuccess && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="bg-white rounded-xl w-[260px] p-4 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div className="w-12 h-12 bg-[#0A402F] rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} className="text-white" />
            </div>

            {/* Title */}
            <h3 className="text-[#333333] font-['Lora'] text-lg mb-1">Registration Confirmed!</h3>

            {/* Event Name */}
            <p className="text-[#0A402F] font-medium font-['Inter'] text-sm mb-0.5">{event.title}</p>

            {/* Date & Time */}
            <p className="text-[#B48F5E] text-xs font-['Inter'] mb-3">
              {event.date}{event.time && ` at ${event.time}`}
            </p>

            {/* Email confirmation */}
            <p className="text-gray-400 text-xs font-['Inter'] mb-3">
              Confirmation sent to {formData.email}
            </p>

            {/* Amount to Pay */}
            {displayPrice !== 'Free' && (
              <div className="bg-[#FFFBEA] rounded-lg py-2 px-3 mb-4">
                <p className="text-gray-400 text-xs font-['Inter']">Amount</p>
                <p className="text-[#0A402F] font-bold text-lg font-['Inter']">{displayPrice}</p>
              </div>
            )}
            {/* Amount to Pay (member) */}
            {displayMemberFee !== 'Free' && (
              <div className="bg-[#FFFBEA] rounded-lg py-2 px-3 mb-4">
                <p className="text-gray-400 text-xs font-['Inter']">Amount</p>
                <p className="text-[#0A402F] font-bold text-lg font-['Inter']">{displayMemberFee}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              {displayPrice !== 'Free' && (
                <button
                  type="button"
                  onClick={() => {
                    console.log('Pay clicked');
                  }}
                  className="w-full bg-[#B48F5E] hover:bg-[#A07D4E] text-white h-10 rounded-lg font-['Inter'] text-sm font-medium"
                >
                  Pay Now
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowSuccess(false);
                  onNavigate('events');
                }}
                className="w-full bg-[#0A402F] hover:bg-[#083525] text-white h-10 rounded-lg font-['Inter'] text-sm font-medium"
              >
                Browse More Events
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSuccess(false);
                onNavigate('event-details');
              }}
              className="w-full text-gray-400 text-xs font-['Inter'] mt-4 py-2 hover:text-gray-600"
            >
              Back to Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
