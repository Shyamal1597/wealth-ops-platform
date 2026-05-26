# Email Setup Instructions for Feedback Form

The feedback form on your website sends submissions as Word documents to **Shyamal.gajjar@sunidhi.com**. To enable this functionality, you need to configure SMTP email settings.

## Prerequisites

You need access to an email account that can send emails via SMTP. Common options:
- Gmail
- Outlook/Office 365
- Company email server

## Setup Steps

### Option 1: Using Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication on Gmail**
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env.local File**
   - Open `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\.env.local`
   - Update these lines:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-gmail-address@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_FROM=your-gmail-address@gmail.com
   ```

4. **Restart the Development Server**
   ```bash
   # Press Ctrl+C to stop the current server
   # Then restart:
   cd C:\Users\SSFL-RETAIL-017\sunidhi-nextjs
   npm run dev
   ```

### Option 2: Using Outlook/Office 365

1. **Update .env.local File**
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=your-email@outlook.com
   SMTP_PASS=your-password
   SMTP_FROM=your-email@outlook.com
   ```

2. **Restart the Development Server**

### Option 3: Using Company SMTP Server

If Sunidhi has its own email server:

1. **Get SMTP Details from IT Department**
   - SMTP host address
   - SMTP port (usually 587 or 465)
   - Authentication credentials

2. **Update .env.local File**
   ```env
   SMTP_HOST=mail.sunidhi.com
   SMTP_PORT=587
   SMTP_USER=website@sunidhi.com
   SMTP_PASS=password-here
   SMTP_FROM=noreply@sunidhi.com
   ```

3. **Restart the Development Server**

## Testing the Feedback Form

Once configured:

1. Visit: http://localhost:3000/feedback
2. Fill out the form completely
3. Submit the feedback
4. Check the inbox at **Shyamal.gajjar@sunidhi.com**

You should receive:
- An HTML email with the feedback details
- A Word document (.docx) attachment with formatted feedback

## What the Email Contains

### Email Body (HTML Format):
- Customer information (name, email, phone)
- Feedback category and subject
- Submission timestamp
- Full feedback message
- Professional Sunidhi branding

### Word Document Attachment:
- Professionally formatted document
- All customer information
- Feedback details
- Timestamp in IST
- Sunidhi branding colors (Ferrari Red #DC0000)

## Troubleshooting

### Error: "Failed to submit feedback"

**Check the browser console** (F12 → Console tab) for detailed error messages.

**Common Issues:**

1. **SMTP credentials not set**
   - Error: "Missing credentials"
   - Solution: Update .env.local with valid SMTP settings

2. **Invalid credentials**
   - Error: "Invalid login"
   - Solution: Double-check SMTP_USER and SMTP_PASS

3. **Gmail blocking sign-in**
   - Error: "Less secure app"
   - Solution: Use App Password (see Option 1 above)

4. **Port blocked by firewall**
   - Error: "Connection timeout"
   - Solution: Check firewall settings, try port 465 with secure: true

5. **Server not restarted**
   - Error: Still using old configuration
   - Solution: Stop (Ctrl+C) and restart npm run dev

### Check Server Logs

When testing, watch the terminal where npm run dev is running. You'll see error messages there if email sending fails.

### Test with Real Email

For initial testing, you can temporarily change the recipient in the API route:
- Open: `src\app\api\feedback\route.ts`
- Find line: `to: "Shyamal.gajjar@sunidhi.com",`
- Change to your test email: `to: "your-test@email.com",`
- Test the form
- Change it back to: `to: "Shyamal.gajjar@sunidhi.com",`

## Security Notes

- **Never commit .env.local to Git** - It contains sensitive passwords
- The .env.local file is already in .gitignore
- Use App Passwords instead of your main email password
- Consider using a dedicated "no-reply" email account
- For production, use environment variables on your hosting platform

## Production Deployment

When deploying to production:

1. Set environment variables on your hosting platform (Vercel, Netlify, etc.)
2. DO NOT use personal Gmail accounts in production
3. Use company email server or professional email service
4. Consider using services like SendGrid, AWS SES, or Mailgun for better deliverability

## Email Format Preview

**Subject Line:**
```
Website Feedback: [Category] - [Subject]
```

**Example:**
```
Website Feedback: Trading Platform - Unable to place order during market hours
```

**Attachment Name:**
```
Feedback_[Category]_[Timestamp].docx
```

**Example:**
```
Feedback_Trading_Platform_2025-12-18T12-30-45-123Z.docx
```

## Need Help?

If you encounter issues:

1. Check the terminal output where npm run dev is running
2. Check browser console (F12) for client-side errors
3. Verify .env.local file has all required fields
4. Ensure development server was restarted after changing .env.local
5. Test with a simple email service like Gmail first
