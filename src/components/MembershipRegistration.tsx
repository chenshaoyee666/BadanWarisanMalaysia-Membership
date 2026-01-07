import { ArrowLeft, Shield, BookOpen, Building2, CreditCard, Landmark } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FPXPaymentPage } from './FPXPaymentPage';
import { CardPaymentPage } from './CardPaymentPage';
import { GrabPayPaymentPage } from './GrabPayPaymentPage';

// ==========================================
// 1. Define Types
// ==========================================
type Role = {
  id: 'ordinary' | 'student' | 'corporate';
  title: 'Ordinary Member' | 'Student Member' | 'Corporate Member';
  subtitle: string;
  price: string;
  icon: React.ElementType;
  description: string;
};

const ROLES: Role[] = [
  {
    id: 'ordinary',
    title: 'Ordinary Member',
    subtitle: 'The Standard Bearer',
    price: 'RM140',
    icon: Shield,
    description: 'Annual subscription RM90 + RM50 one-time entry fee.',
  },
  {
    id: 'student',
    title: 'Student Member',
    subtitle: 'For the Next Generation',
    price: 'RM70',
    icon: BookOpen,
    description: 'Annual subscription RM20 + RM50 one-time entry fee (Ages 25 and below).',
  },
  {
    id: 'corporate',
    title: 'Corporate Member',
    subtitle: 'For Organizations',
    price: 'RM2,500',
    icon: Building2,
    description: 'Annual subscription RM 2,500.00. For registered companies/societies.',
  }
];

// ==========================================
// 2. Sub-Components (The Building Blocks)
// ==========================================

// Component A: A single clickable card for a role
interface RoleCardProps {
  role: Role;
  isSelected: boolean;
  onClick: () => void;
}

function RoleCard({ role, isSelected, onClick }: RoleCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "border p-4 rounded-xl mb-4 cursor-pointer transition-all flex items-start gap-4",
        isSelected ? "border-[#0A402F] bg-[#0A402F]/5" : "border-[#B48F5E] bg-white hover:border-[#B48F5E]/50"
      )}
    >
      {/* Icon */}
      <div className={cn("p-2 rounded-full shrink-0", isSelected ? "bg-[#0A402F] text-white" : "bg-[#B48F5E]/10 text-[#B48F5E]")}>
        <role.icon size={24} />
      </div>

      {/* The Text */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-[#333333]">{role.title}</h3>
          <span className={cn("font-bold", isSelected ? "text-[#0A402F]" : "text-[#B48F5E]")}>
            {role.price}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-1">{role.subtitle}</p>
        <p className="text-xs text-gray-400 leading-relaxed">{role.description}</p>
      </div>
    </div>
  );
}

// Component B: Step 1 - The Selection Screen
interface RoleSelectionStepProps {
  selectedRole: 'ordinary' | 'student' | 'corporate' | null;
  onSelectRole: (role: 'ordinary' | 'student' | 'corporate') => void;
  onNext: () => void;
}

function RoleSelectionStep({ selectedRole, onSelectRole, onNext }: RoleSelectionStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-6">
        <h2 className="text-[#333333] font-['Lora'] text-2xl mb-2">Select Your Role</h2>
        <p className="text-[#333333] opacity-70 mb-6">Choose your path to begin the journey</p>
      </div>

      <div>
        {ROLES.map(role => (
          <RoleCard
            key={role.id}
            role={role}
            isSelected={selectedRole === role.id}
            onClick={() => onSelectRole(role.id)}
          />
        ))}
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={onNext}
          disabled={!selectedRole}
          className="bg-[#0A402F] hover:bg-[#0A402F]/90 text-white w-full py-6 text-lg rounded-xl shadow-lg shadow-[#0A402F]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue Journey
        </Button>
      </div>
    </div>
  );
}

// Component C: Step 2 - The Registration Form
interface RegistrationFormStepProps {
  selectedRole: 'ordinary' | 'student' | 'corporate' | null;
  onSubmit: () => void;
  existingMembershipId: string | null;
}

function RegistrationFormStep({ selectedRole, onSubmit, existingMembershipId }: RegistrationFormStepProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Personal / Common
    email: '',
    icNumber: '',
    dateOfBirth: '',
    profession: '',

    // Student Specific
    studentEmail: '',
    educationLevel: '',

    // Corporate Specific
    companyName: '',
    companyRoc: '',
    companyPhone: '',
    companyFax: '',
    representativeName: '',
    representativeDesignation: '',

    // Survey
    interests: [] as string[],
    otherInterest: '',
    referralSources: [] as string[],
    otherReferralSource: '',
    volunteerInterest: null as boolean | null,
    volunteerAreas: [] as string[],
    otherVolunteerArea: '',

    // Payment
    paymentReference: '',
  });

  const [formStep, setFormStep] = useState(1); // 1: Details, 2: Survey, 3: Payment
  const [formError, setFormError] = useState<string | null>(null); // Error banner state

  const interestOptions = [
    'Trips',
    'Talks / Seminars',
    'Workshops',
    'Exhibitions',
    'Other'
  ];

  const referralOptions = [
    'Newspaper',
    'Radio',
    'BWM Website',
    'Internet Search',
    'Exhibitions/Talks/Events',
    'Friends/Family',
    'School/University',
    'Tourism Websites',
    'Walk In Visit',
    'Tours',
    'Other'
  ];

  const volunteerAreaOptions = [
    'Heritage Guide/ Rumah Penghulu Tours',
    'Resource Centre/Library',
    'Events',
    'Fund Raising',
    'Other'
  ];

  const handleArrayChange = (field: 'interests' | 'referralSources' | 'volunteerAreas', value: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }));
    } else {
      setFormData(prev => ({ ...prev, [field]: prev[field].filter(i => i !== value) }));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to register.');
      return;
    }

    setLoading(true);
    try {
      const tierLabel = selectedRole === 'student' ? 'Student Member'
        : selectedRole === 'corporate' ? 'Corporate Member'
          : 'Ordinary Member';

      const payload = {
        user_id: user.id,
        status: 'active',
        tier: tierLabel,
        full_name: user.user_metadata?.full_name || '',
        email: formData.email,
        ic_number: formData.icNumber,
        payment_reference: formData.paymentReference,

        // Survey data
        referral_sources: formData.referralSources,
        other_referral_source: formData.otherReferralSource,

        // Only include fields relevant to role
        ...(selectedRole === 'corporate' ? {
          company_name: formData.companyName,
          company_roc: formData.companyRoc,
          company_phone: formData.companyPhone,
          company_fax: formData.companyFax,
          representative_name: formData.representativeName,
          representative_designation: formData.representativeDesignation,
          // Corporate might not have personal DOB/Interests essentially, but formStep 2 is asking for them.
          // We'll capture them if user filled them.
          interests: formData.interests,
          other_interest: formData.otherInterest,
          volunteer_interest: formData.volunteerInterest,
          volunteer_areas: formData.volunteerAreas,
          other_volunteer_area: formData.otherVolunteerArea,
        } : {
          // Ordinary & Student
          date_of_birth: formData.dateOfBirth,
          profession: formData.profession,
          interests: formData.interests,
          other_interest: formData.otherInterest,
          volunteer_interest: formData.volunteerInterest,
          volunteer_areas: formData.volunteerAreas,
          other_volunteer_area: formData.otherVolunteerArea,
        }),
        ...(selectedRole === 'student' ? {
          student_email: formData.studentEmail,
          education_level: formData.educationLevel,
        } : {})
      };

      // Note: expires_at column doesn't exist in DB, so we don't include it
      // The instruction implies removing the finalPayload wrapper and using payload directly.
      // This means the `updated_at` field, which was added in finalPayload, will also be removed.

      let error;

      console.log('Attempting membership save:', { existingMembershipId, payload });

      if (existingMembershipId) {
        // Update existing membership
        console.log('Updating membership ID:', existingMembershipId);
        const result = await supabase
          .from('memberships')
          .update(payload)
          .eq('id', existingMembershipId);
        console.log('Update result:', result);
        error = result.error;
      } else {
        // Create new membership
        console.log('Creating new membership');
        const result = await supabase
          .from('memberships')
          .insert(payload);
        console.log('Insert result:', result);
        error = result.error;
      }

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Success! Navigating to payment...');
      toast.success(existingMembershipId ? 'Membership upgraded successfully!' : 'Registration successful!');
      onSubmit();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Clear previous error
    setFormError(null);

    if (formStep === 1) {
      // Validation based on Role
      if (selectedRole === 'corporate') {
        if (!formData.companyName || !formData.companyRoc || !formData.companyPhone || !formData.representativeName) {
          const errorMsg = 'Please fill in all company details';
          setFormError(errorMsg);
          toast.error(errorMsg);
          return;
        }
        if (!formData.email) {
          const errorMsg = 'Please enter email address';
          setFormError(errorMsg);
          toast.error(errorMsg);
          return;
        }
      } else {
        // Validation for Ordinary / Student
        if (!formData.email || !formData.icNumber || !formData.dateOfBirth || !formData.profession) {
          const errorMsg = 'Please fill in all required fields';
          setFormError(errorMsg);
          toast.error(errorMsg);
          return;
        }
        if (selectedRole === 'student') {
          if (!formData.studentEmail) {
            const errorMsg = 'Please enter student email';
            setFormError(errorMsg);
            toast.error(errorMsg);
            return;
          }
          if (!formData.educationLevel) {
            const errorMsg = 'Please select your education level';
            setFormError(errorMsg);
            toast.error(errorMsg);
            return;
          }
        }
      }
      setFormStep(2);
    } else if (formStep === 2) {
      // Validate Referral
      if (formData.referralSources.includes('Other') && !formData.otherReferralSource) {
        toast.error('Please specify where you heard about us');
        return;
      }

      // We can skip detailed survey validation for Corporate if desired, strictly speaking a company might not 'volunteer'.
      // But keeping it consistent for now.

      // Validate Interests
      if (formData.interests.includes('Other') && !formData.otherInterest) {
        toast.error('Please specify your other interest');
        return;
      }
      // Validate Volunteer (Optional for Corporate? Let's keep it required for consistency or create a rule)
      if (formData.volunteerInterest === null) {
        toast.error('Please answer if you are interested to volunteer');
        return;
      }
      if (formData.volunteerInterest === true) {
        if (formData.volunteerAreas.length === 0) {
          toast.error('Please select at least one area to volunteer in');
          return;
        }
        if (formData.volunteerAreas.includes('Other') && !formData.otherVolunteerArea) {
          toast.error('Please specify your other volunteer area');
          return;
        }
      }
      // CRITICAL FIX: Actually save to database before payment
      handleSubmit();
    }
  };

  const renderStepContent = () => {
    switch (formStep) {
      case 1:
        return (
          <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4">

            {/* Error Banner */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold text-sm">!</span>
                </div>
                <span className="text-sm font-medium">{formError}</span>
              </div>
            )}
            {selectedRole === 'corporate' ? (
              <div className="space-y-4">
                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-gray-700">Company / Organization Name</Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                    placeholder="e.g. My Company Sdn Bhd"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1.5 block text-sm font-medium text-gray-700">ROC No.</Label>
                    <Input
                      value={formData.companyRoc}
                      onChange={(e) => setFormData({ ...formData, companyRoc: e.target.value })}
                      className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                      placeholder="Registration No."
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm font-medium text-gray-700">Office Phone</Label>
                    <Input
                      value={formData.companyPhone}
                      onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                      className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                      placeholder="+603..."
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-gray-700">Fax (Optional)</Label>
                  <Input
                    value={formData.companyFax}
                    onChange={(e) => setFormData({ ...formData, companyFax: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                    placeholder="+603..."
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-gray-700">Company Email</Label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                    placeholder="info@company.com"
                  />
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <Label className="text-sm font-bold text-[#0A402F] mb-3 block">Representative Details</Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-gray-700">Name</Label>
                      <Input
                        value={formData.representativeName}
                        onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                        className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-gray-700">Designation</Label>
                      <Input
                        value={formData.representativeDesignation}
                        onChange={(e) => setFormData({ ...formData, representativeDesignation: e.target.value })}
                        className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                        placeholder="e.g. Director / Manager"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Standard Fields for Ordinary/Student
              <>
                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-gray-700">IC / Passport Number</Label>
                  <Input
                    value={formData.icNumber}
                    onChange={(e) => setFormData({ ...formData, icNumber: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                    placeholder="e.g. 900101-14-1234"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1.5 block text-sm font-medium text-gray-700">Date of Birth</Label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm font-medium text-gray-700">Profession</Label>
                    <Input
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                      placeholder="Company Name / Job"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</Label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                    placeholder="name@example.com"
                  />
                </div>
                {selectedRole === 'student' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-gray-700">Student Email</Label>
                      <Input
                        value={formData.studentEmail}
                        onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                        className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                        placeholder="student@university.edu.my"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-gray-700">Currently enrolled in an education institution at <span className="text-red-500">*</span></Label>
                      <select
                        value={formData.educationLevel}
                        onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                        className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A402F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%230A402F%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px] pr-10"
                      >
                        <option value="" disabled>Choose</option>
                        <option value="School">School (Primary or Secondary)</option>
                        <option value="Undergraduate">Undergraduate (Diploma, Degree or equivalent)</option>
                        <option value="Postgraduate">Postgraduate (Master's Degree, Doctorate)</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4">

            {/* 1. Referral Source */}
            <div>
              <Label className="mb-3 block text-sm font-medium text-gray-700">I heard about Badan Warisan Malaysia from:</Label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {referralOptions.map((option) => {
                  const isSelected = formData.referralSources.includes(option);
                  return (
                    <div
                      key={option}
                      onClick={() => handleArrayChange('referralSources', option, !isSelected)}
                      className={cn(
                        "cursor-pointer rounded-xl border p-3 flex items-center justify-center transition-all duration-200 text-center h-full",
                        isSelected
                          ? "border-[#0A402F] bg-[#0A402F] text-white shadow-md transform scale-[1.02]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-[#0A402F]/50 hover:bg-[#0A402F]/5"
                      )}
                    >
                      <span className="text-xs font-medium">{option}</span>
                    </div>
                  );
                })}
              </div>
              {formData.referralSources.includes('Other') && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <Input
                    value={formData.otherReferralSource}
                    onChange={(e) => setFormData({ ...formData, otherReferralSource: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                    placeholder="Please specify..."
                  />
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* 2. Interests Survey */}
            <div>
              <Label className="mb-3 block text-sm font-medium text-gray-700">I am interested in:</Label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {interestOptions.map((interest) => {
                  const isSelected = formData.interests.includes(interest);
                  return (
                    <div
                      key={interest}
                      onClick={() => handleArrayChange('interests', interest, !isSelected)}
                      className={cn(
                        "cursor-pointer rounded-xl border p-3 flex items-center justify-center transition-all duration-200",
                        isSelected
                          ? "border-[#0A402F] bg-[#0A402F] text-white shadow-md transform scale-[1.02]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-[#0A402F]/50 hover:bg-[#0A402F]/5"
                      )}
                    >
                      <span className="text-sm font-medium">{interest}</span>
                    </div>
                  );
                })}
              </div>
              {formData.interests.includes('Other') && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <Input
                    value={formData.otherInterest}
                    onChange={(e) => setFormData({ ...formData, otherInterest: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:border-[#0A402F]"
                    placeholder="Please specify..."
                  />
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* 3. Volunteer Interest */}
            <div>
              <Label className="mb-3 block text-sm font-medium text-gray-700">I am interested to help as a volunteer:</Label>
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  onClick={() => setFormData({ ...formData, volunteerInterest: true })}
                  className={cn(
                    "flex-1 py-6 rounded-xl border transition-all",
                    formData.volunteerInterest === true
                      ? "bg-[#0A402F] text-white border-[#0A402F] shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  onClick={() => setFormData({ ...formData, volunteerInterest: false, volunteerAreas: [] })}
                  className={cn(
                    "flex-1 py-6 rounded-xl border transition-all",
                    formData.volunteerInterest === false
                      ? "bg-[#0A402F] text-white border-[#0A402F] shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  No
                </Button>
              </div>

              {/* Volunteer Areas (Conditional) */}
              {formData.volunteerInterest === true && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 bg-[#FAF8F1] p-4 rounded-xl border border-[#B48F5E]/20">
                  <Label className="mb-3 block text-sm font-medium text-[#0A402F]">Please indicate area(s) you would like to help in:</Label>
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    {volunteerAreaOptions.map((area) => {
                      const isSelected = formData.volunteerAreas.includes(area);
                      return (
                        <div
                          key={area}
                          onClick={() => handleArrayChange('volunteerAreas', area, !isSelected)}
                          className={cn(
                            "cursor-pointer rounded-lg border p-3 flex items-center transition-all duration-200",
                            isSelected
                              ? "border-[#0A402F] bg-[#0A402F]/10 text-[#0A402F] font-medium"
                              : "border-gray-200 bg-white text-gray-600 hover:border-[#0A402F]/30"
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors",
                            isSelected ? "bg-[#0A402F] border-[#0A402F]" : "border-gray-300"
                          )}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                          </div>
                          <span className="text-sm">{area}</span>
                        </div>
                      );
                    })}
                  </div>
                  {formData.volunteerAreas.includes('Other') && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <Input
                        value={formData.otherVolunteerArea}
                        onChange={(e) => setFormData({ ...formData, otherVolunteerArea: e.target.value })}
                        className="bg-white border-gray-200 focus:border-[#0A402F]"
                        placeholder="Please specify..."
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        );
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8">
      <div className="text-center mb-6">
        <h2 className="text-[#333333] font-['Lora'] text-2xl mb-2">
          {selectedRole ? ROLES.find(r => r.id === selectedRole)?.title : 'Registration'}
        </h2>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn("h-1.5 rounded-full transition-all duration-300",
                s <= formStep ? "w-8 bg-[#0A402F]" : "w-1.5 bg-gray-200"
              )}
            />
          ))}
        </div>
        <p className="text-[#333333] opacity-70">
          {formStep === 1 ? 'Details' : 'Survey'}
        </p>
      </div>

      {renderStepContent()}

      <div className="mt-8 flex gap-3">
        {formStep > 1 && (
          <Button
            onClick={() => setFormStep(formStep - 1)}
            variant="outline"
            className="flex-1 py-6 text-lg rounded-xl border-gray-200 text-gray-600"
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={loading}
          className={`bg-[#0A402F] hover:bg-[#0A402F]/90 text-white py-6 text-lg rounded-xl shadow-lg shadow-[#0A402F]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${formStep > 1 ? 'flex-[2]' : 'w-full'}`}
        >
          {loading ? 'Processing...' : (formStep === 2 ? 'Proceed to Payment' : 'Next Step')}
        </Button>
      </div>
    </div>
  );
}

// ==========================================
// 3. Main Component (The Container)
// ==========================================

interface MembershipRegistrationProps {
  onNavigate: (screen: string) => void;
}

export function MembershipRegistration({ onNavigate }: MembershipRegistrationProps) {
  const { user } = useAuth();

  // State for tracking the current step (1 = role, 2 = form, 3 = payment)
  const [step, setStep] = useState(1);

  // State for tracking the selected role ('ordinary' | 'student' | 'corporate' | null)
  const [role, setRole] = useState<'ordinary' | 'student' | 'corporate' | null>(null);

  // Payment method states
  const [paymentStep, setPaymentStep] = useState<'select' | 'fpx' | 'card' | 'grabpay' | 'processing'>('select');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'fpx' | 'card' | 'grabpay'>('fpx');

  // Check if user already has a membership (skip if in upgrade mode)
  // Note: For upgrade flow, the button text will say "Change Tier" instead of "Submit"
  const [isUpgradeMode, setIsUpgradeMode] = useState(false);
  const [isCheckingMembership, setIsCheckingMembership] = useState(true);
  const [existingMembershipId, setExistingMembershipId] = useState<string | null>(null);

  useEffect(() => {
    const checkExistingMembership = async () => {
      if (!user) {
        setIsCheckingMembership(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('memberships')
          .select('id, status, tier')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        console.log('Membership query result:', { data, error });

        // Check if we got a membership (data is an array now, not single)
        if (!error && data && data.length > 0) {
          const membership = data[0];

          // Check if user is in upgrade mode via localStorage
          const isUpgrade = localStorage.getItem('membershipUpgradeMode') === 'true';

          console.log('Checking membership:', { membership, isUpgrade });

          if (isUpgrade) {
            // User is upgrading - allow access, show different message
            setIsUpgradeMode(true);
            setExistingMembershipId(membership.id);
            toast.info(`Current tier: ${membership.tier}. Select your new tier below.`);
            setIsCheckingMembership(false);
            // Clear the flag after using it
            localStorage.removeItem('membershipUpgradeMode');
          } else {
            // Regular access - show message and redirect with slight delay for smooth transition
            toast.success("Welcome back! Taking you to your membership card... 🎉");
            // Add a small delay before redirect for smoother transition
            setTimeout(() => {
              onNavigate('membership');
            }, 800);
          }
        } else {
          // No membership found, proceed with registration
          console.log('No existing membership found');
          setIsCheckingMembership(false);
        }
      } catch (err) {
        // Error occurred, proceed with registration
        console.log('Error checking membership:', err);
        setIsCheckingMembership(false);
      }
    };

    checkExistingMembership();
  }, [user, onNavigate]);

  // Loading skeleton while checking membership
  if (isCheckingMembership) {
    return (
      <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
        {/* Header Skeleton */}
        <header className="bg-[#0A402F] px-4 py-4 flex items-center shadow-md">
          <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />
          <div className="ml-4 h-6 w-32 bg-white/20 rounded animate-pulse" />
        </header>

        {/* Content Skeleton */}
        <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0A402F]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#0A402F] border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-[#333333] font-['Lora'] text-lg">Checking your membership...</p>
            <p className="text-gray-400 text-sm mt-2">Just a moment</p>
          </div>

          {/* Skeleton cards */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Render payment pages as full-screen (early return to avoid double headers)
  if (step === 3 && paymentStep === 'fpx') {
    return (
      <FPXPaymentPage
        onBack={() => setPaymentStep('select')}
        onSuccess={() => onNavigate('membership-success')}
        amount={role === 'student' ? 70 : role === 'corporate' ? 2550 : 140}
      />
    );
  }

  if (step === 3 && paymentStep === 'card') {
    return (
      <CardPaymentPage
        onBack={() => setPaymentStep('select')}
        onSuccess={() => onNavigate('membership-success')}
        amount={role === 'student' ? 70 : role === 'corporate' ? 2550 : 140}
      />
    );
  }

  if (step === 3 && paymentStep === 'grabpay') {
    return (
      <GrabPayPaymentPage
        onBack={() => setPaymentStep('select')}
        onSuccess={() => onNavigate('membership-success')}
        amount={role === 'student' ? 70 : role === 'corporate' ? 2550 : 140}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
      {/* Header Section */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center shadow-md z-10 sticky top-0">
        <button className="text-[#FEFDF5] mr-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => {
            if (step === 1) {
              onNavigate('home');
            } else if (step === 3 && paymentStep !== 'select') {
              setPaymentStep('select');
            } else {
              setStep(step - 1);
              if (step === 3) setPaymentStep('select');
            }
          }}
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="text-[#FEFDF5] font-['Lora'] text-lg font-medium">
          {step === 1 ? 'Select Your Path' : step === 2 ? 'Join the Community' : 'Payment'}
        </h2>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-24 max-w-md mx-auto w-full">
        {step === 1 && (
          <RoleSelectionStep
            selectedRole={role}
            onSelectRole={setRole}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <RegistrationFormStep
            selectedRole={role}
            onSubmit={() => setStep(3)}
            existingMembershipId={existingMembershipId}
          />
        )}

        {step === 3 && paymentStep === 'select' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-[#333333] font-['Lora'] text-xl font-bold">Complete Payment</h3>
              <p className="text-gray-500 text-sm mt-2">Select your preferred payment method</p>
            </div>

            {/* Payment Amount */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-2xl font-bold text-[#0A402F]">
                  {role === 'student' ? 'RM 70' : role === 'corporate' ? 'RM 2,550' : 'RM 140'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {role === 'student' ? 'RM50 entry + RM20 annual' : role === 'corporate' ? 'RM50 entry + RM2,500 annual' : 'RM50 entry + RM90 annual'}
              </p>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              {/* FPX */}
              <button
                onClick={() => setSelectedPaymentMethod('fpx')}
                className={cn(
                  "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all",
                  selectedPaymentMethod === 'fpx'
                    ? "border-[#0A402F] bg-[#0A402F]/5"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Landmark size={24} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#333333]">FPX Online Banking</p>
                  <p className="text-xs text-gray-500">Pay directly from your bank</p>
                </div>
              </button>

              {/* Card */}
              <button
                onClick={() => setSelectedPaymentMethod('card')}
                className={cn(
                  "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all",
                  selectedPaymentMethod === 'card'
                    ? "border-[#0A402F] bg-[#0A402F]/5"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CreditCard size={24} className="text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#333333]">Credit/Debit Card</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard, AMEX</p>
                </div>
              </button>

              {/* GrabPay */}
              <button
                onClick={() => setSelectedPaymentMethod('grabpay')}
                className={cn(
                  "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all",
                  selectedPaymentMethod === 'grabpay'
                    ? "border-[#0A402F] bg-[#0A402F]/5"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">G</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#333333]">GrabPay</p>
                  <p className="text-xs text-gray-500">Pay with GrabPay wallet</p>
                </div>
              </button>
            </div>

            {/* Proceed Button */}
            <Button
              onClick={() => setPaymentStep(selectedPaymentMethod)}
              className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-14 rounded-xl text-lg font-bold mt-6"
            >
              Proceed to Pay
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}