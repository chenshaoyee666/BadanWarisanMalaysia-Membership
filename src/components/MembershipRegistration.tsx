import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useState } from 'react';

interface MembershipRegistrationProps {
  onNavigate: (screen: string) => void;
}

export function MembershipRegistration({ onNavigate }: MembershipRegistrationProps) {
  const [membershipType, setMembershipType] = useState('ordinary');

  return (
    <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center">
        <button onClick={() => onNavigate('home')} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-white font-['Lora'] flex-1 text-center mr-6">Become a Member</h2>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-24">
        {/* Form Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-[#333333] font-['Lora'] mb-4">Member Registration</h3>
          <p className="text-[#333333] opacity-70 mb-6">Join us in preserving Malaysia's rich heritage</p>

          <form className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-[#333333] mb-2 block">Full Name</Label>
              <Input 
                id="fullName"
                placeholder="Enter your full name"
                className="w-full bg-[#FEFDF5] border-gray-300 rounded-lg"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-[#333333] mb-2 block">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="w-full bg-[#FEFDF5] border-gray-300 rounded-lg"
              />
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phone" className="text-[#333333] mb-2 block">Phone Number</Label>
              <Input 
                id="phone"
                type="tel"
                placeholder="+60 12-345 6789"
                className="w-full bg-[#FEFDF5] border-gray-300 rounded-lg"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-[#333333] mb-2 block">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="Create a secure password"
                className="w-full bg-[#FEFDF5] border-gray-300 rounded-lg"
              />
            </div>

            {/* Membership Type */}
            <div className="pt-4">
              <Label className="text-[#333333] mb-3 block">Membership Type</Label>
              <RadioGroup value={membershipType} onValueChange={setMembershipType}>
                <div className="flex items-center space-x-2 p-4 border-2 border-[#0A402F] rounded-lg bg-[#0A402F]/5 mb-3">
                  <RadioGroupItem value="ordinary" id="ordinary" className="border-[#0A402F]" />
                  <Label htmlFor="ordinary" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[#333333]">Ordinary</p>
                        <p className="text-[#333333] opacity-70">Full membership benefits</p>
                      </div>
                      <span className="text-[#0A402F]">RM50/yr</span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border-2 border-gray-300 rounded-lg">
                  <RadioGroupItem value="student" id="student" className="border-[#0A402F]" />
                  <Label htmlFor="student" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[#333333]">Student</p>
                        <p className="text-[#333333] opacity-70">Valid student ID required</p>
                      </div>
                      <span className="text-[#0A402F]">RM20/yr</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </form>
        </div>

        {/* Benefits Preview */}
        <div className="bg-[#0A402F]/5 rounded-2xl p-6 mb-6 border-2 border-[#0A402F]">
          <h4 className="text-[#333333] font-['Lora'] mb-3">What You'll Get</h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">✓</span>
              <span className="text-[#333333]">Free entry to all events and programmes</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">✓</span>
              <span className="text-[#333333]">Quarterly heritage magazine</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">✓</span>
              <span className="text-[#333333]">Discounts at partner museums</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">✓</span>
              <span className="text-[#333333]">Access to exclusive member events</span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button 
          className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FEFDF5] h-12 rounded-lg"
          onClick={() => onNavigate('membership')}
        >
          Proceed to Payment
        </Button>
      </main>
    </div>
  );
}
