import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import PhoneVerification from '../components/PhoneVerification'

export default function Profile() {
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('') // Add phoneNumber state
  
  const handleSendCode = async (phoneNumber: string) => {
    try {
      setIsVerifying(true)
      const result = await sendVerificationCode(phoneNumber)
      if (result.error) {
        setVerificationMessage('Failed to send code: ' + result.error.message)
      } else {
        setVerificationMessage('Verification code sent!')
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerifyCode = async (phoneNumber: string) => {
    try {
      setIsVerifying(true)
      const result = await verifyCode(phoneNumber, verificationCode)
      if (result.status === 'approved') {
        setVerificationMessage('Phone number verified!')
        // Update user profile in database here
      } else {
        setVerificationMessage('Invalid verification code')
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerificationComplete = async (success: boolean) => {
    if (success) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          phone_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', session?.user.id)

      if (!error) {
        setMessage('Phone number verified successfully')
      }
    }
  }

  const handleVerificationSuccess = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          phone_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', session?.user?.id)

      if (error) throw error
      await getProfile() // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <div>
      {/* ...existing profile fields... */}
      
      <div className="mt-6 border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Phone Verification</h3>
        {phone ? (
          <PhoneVerification 
            phoneNumber={phone}
            onVerificationSuccess={handleVerificationSuccess}
          />
        ) : (
          <p className="text-yellow-600">Please add a phone number first</p>
        )}
      </div>

      {/* ...existing code... */}
    </div>
  )
}