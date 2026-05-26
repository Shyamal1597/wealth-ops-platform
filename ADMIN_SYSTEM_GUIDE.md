# Sunidhi Securities - Admin System Guide

## Overview

This document describes the backend admin system for the Sunidhi Securities website, which allows authorized administrators to manage customer feedbacks, upload research reports, and manage educational content.

## Admin Access

### Admin Portal URL
```
http://192.168.48.102:3000/admin/login
```

### Admin Credentials

Two backend users have been created with full administrative privileges:

**Admin User 1:**
- Username: `admin`
- Email: `admin@sunidhi.com`
- Password: `Admin@123`
- Full Name: Sunidhi Admin

**Admin User 2:**
- Username: `shyamal`
- Email: `shyamal.gajjar@sunidhi.com`
- Password: `Admin@123`
- Full Name: Shyamal Gajjar

## Features

### 1. Feedback Management

**Location:** Admin Dashboard > Feedbacks Tab

**Features:**
- View all customer feedbacks submitted through the website
- See complete feedback details including:
  - Customer name, email, phone
  - Feedback category (Website, Services, Support, etc.)
  - Subject and detailed message
  - Submission date and time
- Download individual feedbacks as Word documents (.docx)
- Feedbacks are automatically saved to local storage
- Real-time display of total feedback count

**Storage Location:**
```
C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\feedback-submissions\
```

Each feedback is saved as:
- `{feedback-id}.json` - JSON data file
- `{feedback-id}.docx` - Word document format

### 2. Research Reports Management

**Location:** Admin Dashboard > Research Reports Tab

**Status:** Placeholder for future implementation

**Planned Features:**
- Upload PDF research reports
- Categorize reports by type (Equity, Derivatives, Market Analysis, etc.)
- Set publication dates
- Manage report visibility
- Download/Delete reports

### 3. Educational Content Management

**Location:** Admin Dashboard > Educational Content Tab

**Status:** Placeholder for future implementation

**Planned Features:**
- Upload educational articles, videos, tutorials
- Categorize content by topic
- Manage content visibility
- Track content views/downloads

## Technical Details

### Authentication System

- **Technology:** JWT (JSON Web Tokens) with HTTP-only cookies
- **Session Duration:** 8 hours
- **Password Hashing:** bcrypt with 10 salt rounds
- **Storage:** JSON file-based database (`data/admins.json`)

### API Endpoints

**Admin Login:**
```
POST /api/admin/login
Body: { usernameOrEmail, password }
```

**Get Feedbacks:**
```
GET /api/admin/feedbacks
Requires: Valid admin-token cookie
```

**User Logout:**
```
POST /api/auth/logout
```

### File Structure

```
sunidhi-nextjs/
├── data/
│   └── admins.json              # Admin user database
├── feedback-submissions/        # Feedback storage
│   ├── {id}.json               # Feedback data
│   └── {id}.docx               # Feedback Word doc
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Admin login page
│   │   │   └── dashboard/
│   │   │       └── page.tsx    # Admin dashboard
│   │   └── api/
│   │       └── admin/
│   │           ├── login/
│   │           │   └── route.ts # Login API
│   │           └── feedbacks/
│   │               └── route.ts # Feedbacks API
│   └── lib/
│       └── admin-auth.ts        # Authentication utilities
└── scripts/
    └── init-admins.js           # Admin initialization script
```

## How to Use

### Accessing the Admin Panel

1. Open your browser
2. Navigate to: `http://192.168.48.102:3000/admin/login`
3. Enter username and password
4. Click "Login to Admin Panel"
5. You'll be redirected to the dashboard

### Viewing Feedbacks

1. After logging in, you'll see the Feedbacks tab (default view)
2. Browse through all submitted feedbacks
3. Each feedback card shows:
   - Subject and category
   - Customer details (name, email, phone)
   - Submission date/time
   - Full message content
4. Click "Download Doc" to download the Word document version

### Logging Out

1. Click the "Logout" button in the top-right corner
2. You'll be redirected back to the login page

## Customer Feedback Submission

### Public Feedback Form
```
http://192.168.48.102:3000/feedback
```

When customers submit feedback:
1. Form data is validated
2. A Word document is automatically generated
3. Data is saved locally in JSON and DOCX formats
4. Success message is shown to the customer
5. Feedback immediately appears in admin dashboard

### Email Notifications

**Current Status:** Email notifications are NOT active

**Why:**  The SMTP credentials in `.env.local` are placeholders. To enable email notifications:

1. Open `.env.local`
2. Update the following with real credentials:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-actual-email@gmail.com
   SMTP_PASS=your-actual-app-password
   SMTP_FROM=noreply@sunidhi.com
   ```
3. For Gmail, you need to create an "App Password"
4. Restart the development server

**Email Recipient:** All feedbacks will be sent to `Shyamal.gajjar@sunidhi.com`

## Website Access URLs

### For Users (Clients)
```
http://192.168.48.102:3000
```

**Main Sections:**
- Home: `/`
- About: `/about/story`, `/about/leadership`, etc.
- Services: `/services/equity-trading`, etc.
- Markets & Research: `/markets/research`, etc.
- Login: `/login`
- Register: `/register`
- Feedback: `/feedback`

### For Admins
```
http://192.168.48.102:3000/admin/login
```

### Client Login Credentials (Demo Accounts)
```
Username: client1, client2, client3, client4, or client5
Password: Demo@123
```

## Important Notes

### IP Address Configuration

The website is configured to always use `http://192.168.48.102:3000` as specified in `.env.local`:

```
NEXT_PUBLIC_SITE_URL=http://192.168.48.102:3000
```

**Why port 3000?**
- IIS reverse proxy on port 80 requires additional setup
- Using port 3000 directly works immediately
- Easier for development and testing

**To change the IP address:**
1. Edit `.env.local`
2. Update `NEXT_PUBLIC_SITE_URL`
3. Restart the development server

### Running the Website

The website must be running for admin access to work:

```bash
cd C:\Users\SSFL-RETAIL-017\sunidhi-nextjs
npm run dev
```

The server will start on `http://192.168.48.102:3000`

### Data Persistence

All feedback data is stored locally in:
```
C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\feedback-submissions\
```

**Backup Recommendations:**
- Regularly backup this directory
- Consider setting up automated backups
- Archive old feedbacks periodically

## Security Considerations

1. **Admin Passwords:** Change default passwords in production
2. **JWT Secret:** Use a strong, unique secret (configured in `.env.local`)
3. **HTTPS:** Consider using HTTPS in production
4. **File Permissions:** Ensure proper file system permissions
5. **Session Timeout:** Admin sessions expire after 8 hours

## Troubleshooting

### Cannot Login to Admin Panel

**Check:**
1. Is the development server running? (`npm run dev`)
2. Are you using the correct credentials?
3. Is the URL correct? (`http://192.168.48.102:3000/admin/login`)
4. Clear browser cookies and try again

### Feedbacks Not Showing

**Check:**
1. Are you logged in as admin?
2. Have any feedbacks been submitted?
3. Check the `feedback-submissions` folder for JSON files
4. Check browser console for errors

### Email Not Received

**This is expected!** Email notifications are disabled by default.
To enable, update SMTP settings in `.env.local` with real credentials.

## Future Enhancements

### Planned Features

1. **Research Reports Upload**
   - Multi-file PDF upload
   - Categorization and tagging
   - Search and filter functionality
   - Access control per report

2. **Educational Content Management**
   - Article/video uploads
   - Content categorization
   - Rich text editor
   - Analytics and tracking

3. **User Analytics**
   - View user registration statistics
   - Track login activity
   - Monitor feedback trends
   - Generate reports

4. **Advanced Feedback Management**
   - Mark feedbacks as read/unread
   - Respond to feedbacks
   - Archive old feedbacks
   - Export to Excel/CSV

## Support

For technical support or questions:
- Contact: Shyamal Gajjar
- Email: shyamal.gajjar@sunidhi.com
