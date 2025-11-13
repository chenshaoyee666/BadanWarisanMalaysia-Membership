# Twilio Phone Verification Setup Guide

This app uses Twilio via Supabase for phone number verification. Follow these steps to set it up.

## Prerequisites

1. A Supabase project with Twilio credentials configured
2. Twilio account with SMS capabilities

## Setting Up Twilio in Supabase

### 1. Configure Twilio in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Phone** provider and enable it
4. Enter your Twilio credentials:
   - **Account SID**: Your Twilio Account SID
   - **Auth Token**: Your Twilio Auth Token
   - **Phone Number**: Your Twilio phone number (must be verified in Twilio)
5. Save the settings

### 2. Verify Twilio Phone Number

1. In your Twilio dashboard, go to **Phone Numbers** → **Manage** → **Active Numbers**
2. Make sure you have a phone number that can send SMS
3. For testing, you can use Twilio's trial phone number

## How Phone Verification Works

### During Sign Up

1. User enters phone number during registration
2. After account creation, user is redirected to phone verification screen
3. OTP code is automatically sent to the phone number via Twilio
4. User enters the 6-digit code
5. Code is verified via Supabase
6. Phone number is marked as verified in user metadata
7. User is redirected to home screen

### During Profile Update

1. User can change phone number only **once** (tracked via `phone_change_count`)
2. If phone number is changed:
   - User is redirected to phone verification screen
   - OTP code is sent to the new phone number
   - After verification:
     - Phone number is updated in database
     - `phone_change_count` is incremented to 1
     - Phone number field becomes disabled (can't change again)
3. If user tries to change phone number again:
   - Error message: "You can only change your phone number once"
   - Phone number field is disabled

## Data Storage

Phone verification status and change count are stored in `user_metadata`:
- `phone_number`: The verified phone number
- `phone_verified`: Boolean indicating if phone is verified
- `phone_change_count`: Number of times phone has been changed (0 or 1)

## Testing

### Test Phone Numbers

For testing with Twilio trial account, you can use:
- Your own verified phone number (must be verified in Twilio dashboard)
- Twilio test credentials (limited functionality)

### Testing Flow

1. **Sign Up Test**:
   - Create a new account with a valid phone number
   - You should receive an OTP code via SMS
   - Enter the code to verify

2. **Profile Update Test**:
   - Log in to an existing account
   - Go to Edit Profile
   - Change phone number (first time should work)
   - Verify the new phone number
   - Try to change again (should be blocked)

## Troubleshooting

### OTP Not Received

1. Check Twilio account balance (trial accounts have limits)
2. Verify phone number is correct format (include country code, e.g., +60123456789)
3. Check Twilio logs in Twilio dashboard
4. Verify Twilio credentials in Supabase are correct

### Verification Fails

1. Check that OTP code is entered correctly
2. Verify code hasn't expired (usually 5-10 minutes)
3. Check Supabase logs for errors
4. Ensure Twilio is properly configured in Supabase

### Phone Number Change Blocked

- This is expected behavior after first change
- User can only change phone number once
- Contact support message is shown

## Security Notes

- OTP codes expire after a set time (configured in Supabase)
- Rate limiting is handled by Supabase/Twilio
- Phone numbers are stored securely in Supabase
- Only verified phone numbers are saved

## API Methods Used

- `supabase.auth.signInWithOtp({ phone })` - Sends OTP to phone
- `supabase.auth.verifyOtp({ phone, token, type: 'sms' })` - Verifies OTP code
- `supabase.auth.updateUser({ data })` - Updates phone number and metadata

