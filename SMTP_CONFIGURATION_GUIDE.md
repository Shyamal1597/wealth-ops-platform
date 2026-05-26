# SMTP Email Configuration Guide

## Problem
Admin accounts are created successfully, but emails with credentials are not being sent to new admins.

## Root Cause
The SMTP configuration in `.env.local` contains placeholder values that need to be replaced with actual credentials.

## Solution

### Option 1: Using Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication on your Gmail account**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other" (enter "Sunidhi Admin Portal")
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

3. **Update `.env.local` file**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-actual-email@gmail.com
   SMTP_PASSWORD=abcdefghijklmnop  # The 16-char app password (no spaces)
   ```

4. **Restart the development server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

### Option 2: Using Outlook/Hotmail

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-outlook-password
```

### Option 3: Using SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com
2. Create an API key
3. Configure:
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Option 4: Using AWS SES (Production)

```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
```

## Testing

1. **Check Server Console**
   After updating `.env.local` and restarting, you should see logs when creating a new admin:
   ```
   📧 Attempting to send email to: newadmin@sunidhi.com
      From: your-email@gmail.com
      Host: smtp.gmail.com
      Port: 587
   ✅ Email sent successfully to: newadmin@sunidhi.com
   ```

2. **Error Messages**
   If SMTP is not configured, you'll see:
   ```
   ❌ EMAIL ERROR: SMTP_USER not configured in .env.local
      Please configure SMTP settings in .env.local file
      SMTP_USER and SMTP_PASSWORD must be set with valid credentials
   ```

3. **User Interface**
   - If email fails: "⚠️ Failed to send email. Please check SMTP configuration in .env.local"
   - If email succeeds: "✅ Credentials sent via email to admin@sunidhi.com"

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env.local` to version control
- Use environment-specific credentials
- For production, use a dedicated email service (SendGrid, AWS SES, Mailgun)
- Gmail has sending limits (500 emails/day for free accounts)

## Troubleshooting

### Error: "Invalid login"
- Double-check your email and password
- For Gmail, ensure you're using an App Password (not your regular password)
- Verify 2FA is enabled

### Error: "Connection timeout"
- Check firewall settings
- Verify SMTP port (587 or 465)
- Try different SMTP host

### Email goes to spam
- Configure SPF/DKIM records for your domain
- Use a verified sending domain
- Avoid suspicious content in emails

## Current Email Template

When an admin is created with "Send credentials via email" checked, the new admin receives:

**Subject:** Your Sunidhi Admin Account Credentials

**Content:**
- Login credentials (username, email, password)
- Login URL
- Security recommendations

**HTML Format:** Professional branded template with Sunidhi Securities styling

## Next Steps

1. Update `.env.local` with real SMTP credentials
2. Restart the development server
3. Test by creating a new admin with "Send credentials via email" checked
4. Check server console for email sending logs
5. Verify the email arrives in the recipient's inbox

---

**For Support:** Check the server console logs for detailed error messages when creating admins.
