# Email Service Setup with Resend

## Overview

The Lindo Mart Form Management System now uses **Resend** for all email notifications instead of the previous SendGrid/Twilio setup. This provides better email deliverability, beautiful templates, and focuses purely on email communication.

## Setup Instructions

### 1. Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to the **API Keys** section in your dashboard
3. Create a new API key with sending permissions
4. Copy the API key (it will look like `re_xxxxxxxxxx`)

### 2. Verify Your Domain (Important!)

1. In your Resend dashboard, go to **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Add the required DNS records to verify domain ownership
4. Wait for verification (usually takes a few minutes)

### 3. Update Environment Variables

Update your `.env` file with the following variables:

```env
# Resend Email Service Configuration
RESEND_API_KEY=re_your_actual_resend_api_key_here
RESEND_SENDER_EMAIL=Lindo Mart <noreply@yourdomain.com>
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**

- Replace `re_your_actual_resend_api_key_here` with your actual Resend API key
- Replace `noreply@yourdomain.com` with your verified domain email
- Update `FRONTEND_URL` to your production URL when deploying

### 4. Email Templates Included

The system now includes beautiful, responsive email templates for:

#### 📋 New Form Received

- Sent when a new form is submitted to an admin/recipient
- Includes form details, status, and direct link to review

#### 🔄 Form Status Updated

- Sent when form status changes (Pending → Approved, etc.)
- Color-coded status indicators
- Links to view the updated form

#### 👤 Role Updated

- Sent when user roles are changed by administrators
- Clear indication of new permissions and access levels

#### ↗️ Form Transferred

- Sent when forms are moved between users/roles
- Shows who transferred the form and why

#### ⏰ Follow-up Required

- Sent for pending forms that need attention
- Urgent styling to encourage action

#### 🔔 Generic Notifications

- Fallback template for custom alert messages
- Clean, professional design

## Email Triggers

Emails are automatically sent for these events:

### Form Events

- **New Form Submission**: Email sent to designated recipient/role
- **Form Status Change**: Email sent to form submitter and relevant users
- **Form Transfer**: Email sent to new recipient
- **Follow-up Alerts**: Email sent for overdue forms

### User Events

- **Role Updates**: Email sent to user whose role was changed
- **Login Notifications**: Email sent on successful login (optional)

### Admin Events

- **System Notifications**: Email sent to administrators for system events

## Features

### ✅ What's Included

- 📧 **Email-only notifications** (no more SMS costs)
- 🎨 **Beautiful responsive templates** that work on all devices
- 🔗 **Direct action links** to forms and dashboard
- 📊 **Form details** embedded in emails
- 🎯 **Smart email routing** based on message content
- 💪 **Error handling** - system continues if email fails
- 📝 **Comprehensive logging** for debugging
- 🔒 **Secure** - uses environment variables for credentials

### 📱 SMS Service (Available as Helper)

- **Twilio SMS service** is available but **commented out** for future use
- When you need SMS functionality, simply:
  1. Add your real Twilio credentials to `.env`
  2. Uncomment the SMS code in `alerts.service.ts`
  3. SMS will work alongside email notifications

### ❌ What's Removed

- 📧 **SendGrid service** (replaced with Resend)
- 💸 **Dual email service complexity** (consolidated to Resend only)

## Testing

To test the email service:

1. Ensure your environment variables are set correctly
2. Start the application: `npm run start:dev`
3. Trigger any notification event (submit form, update status, etc.)
4. Check your email and server logs for delivery confirmation

## Troubleshooting

### Common Issues

**Email not sending:**

- Verify your RESEND_API_KEY is correct
- Ensure your domain is verified in Resend dashboard
- Check that RESEND_SENDER_EMAIL uses your verified domain

**Template not rendering:**

- Check server logs for specific error messages
- Verify form data is being passed correctly
- Ensure all required fields are present

**Links not working:**

- Verify FRONTEND_URL is set correctly
- Check that the frontend routes match the email links

### Logs

The service logs all email activities:

- ✅ Successful sends: `Form received email sent successfully to user@example.com`
- ❌ Failed sends: `Error sending form received email: [error details]`
- 🔍 Debug info: Check console for detailed error messages

## Cost Savings

By switching from Twilio + SendGrid to Resend:

- 📧 **Email**: Resend offers generous free tier (3,000 emails/month)
- 📱 **SMS**: Eliminated - no more per-message costs
- 🔧 **Maintenance**: Single service to manage instead of two

## Migration Notes

The migration automatically:

- ✅ Removes old Twilio and SendGrid dependencies
- ✅ Updates all notification calls to use new email system
- ✅ Preserves all existing notification triggers
- ✅ Adds improved email templates
- ✅ Maintains backward compatibility with alert system

## How to Enable SMS in the Future

When you want to add SMS notifications alongside emails:

### Step 1: Get Twilio Credentials

1. Go to [twilio.com](https://twilio.com) and create an account
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number for sending SMS

### Step 2: Update Environment Variables

```env
TWILIO_ACCOUNT_SID=your_actual_account_sid
TWILIO_AUTH_TOKEN=your_actual_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 3: Uncomment SMS Code

In `src/alerts/alerts.service.ts`, find this section and uncomment it:

```typescript
// SMS notification using Twilio (uncomment when needed)
// if (user.phoneNumber && this.twilioService.isValidPhoneNumber(user.phoneNumber)) {
//   try {
//     const formattedPhone = this.twilioService.formatPhoneNumber(user.phoneNumber);
//     await this.twilioService.sendSMS(formattedPhone, message);
//     categories.push('sms');
//     console.log(`SMS sent successfully to ${user.phoneNumber}`);
//   } catch (smsError) {
//     console.error('Failed to send SMS notification:', smsError);
//     // Continue execution even if SMS fails
//   }
// }
```

Remove the `//` to uncomment the code, and you'll have both email and SMS notifications!

## Support

If you encounter issues:

1. Check the logs in your terminal/console
2. Verify your Resend dashboard for delivery status
3. Ensure DNS records are properly configured
4. Test with a simple form submission first

The system is designed to be resilient - if emails fail, the core application continues to work normally.
