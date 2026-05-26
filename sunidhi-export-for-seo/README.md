# Sunidhi Securities & Finance Limited - Website

Modern, responsive, and dynamic website for Sunidhi Securities & Finance Limited built with Next.js 15, React 18, TypeScript, and Tailwind CSS.

## 🚀 Project Status: Production Ready

**Version**: 1.0.0
**Release Date**: December 30, 2024
**Status**: ✅ Ready for Production Deployment

## Features

### Core Features
- ✅ Modern, clean design with professional UI
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Built with Next.js 15 App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Component-based architecture
- ✅ SEO optimized
- ✅ Fast performance
- ✅ Accessible (WCAG compliant)

### Dynamic Features
- ✅ **Real-time Market News** - Live RSS feed integration from 7+ sources
- ✅ **JWT Authentication** - Secure user and admin authentication
- ✅ **Content Management System** - Admin dashboard for content updates
- ✅ **Email Integration** - Contact forms and notifications
- ✅ **Analytics Tracking** - Visit tracking and user analytics
- ✅ **Blog System** - Dynamic blog posts with SEO optimization
- ✅ **Document Management** - File uploads and downloads

## Pages Included

### Main Sections
- **Homepage** - Hero, services overview, trust indicators, CTAs
- **Services**
  - Equity Trading
  - Derivatives & Commodities
  - Debt Market
  - Foreign Exchange
  - Insurance
  - Wealth Management

- **Markets & Research**
  - Market Overview
  - Research Reports
  - Daily Updates
  - **Market News** (Real-time RSS feeds)
  - IPO Center
  - Educational Resources

- **Tools**
  - Margin Calculator (interactive)
  - Brokerage Calculator (interactive)
  - SIP Calculator (interactive)
  - Tax Calculator

- **About**
  - Our Story
  - Leadership Team
  - Awards & Recognition
  - Sunidhi Foundation
  - Careers

- **Support**
  - Help Center (FAQs)
  - Contact Us (contact form)
  - Branch Locator
  - Downloads & Forms

- **Account Management**
  - Open Account
  - Login

## Tech Stack

### Frontend
- **Framework**: Next.js 15.1.0 with App Router
- **UI Library**: React 18.3.1
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 3.4.15
- **Icons**: Lucide React 0.460.0
- **Utilities**: clsx, tailwind-merge

### Backend & Integration
- **Authentication**: JWT (jsonwebtoken 9.0.3) + bcryptjs 3.0.3
- **Email**: Nodemailer 7.0.11
- **RSS Parsing**: rss-parser 3.13.0
- **Web Scraping**: Cheerio 1.1.2
- **Document Generation**: docx 9.5.1
- **Session Management**: cookie 1.1.1

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sunidhi-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your credentials
```

Required environment variables:
```env
JWT_SECRET=your-secret-key-here
ADMIN_PASSWORD=hashed-password-here
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

4. Create data directories:
```bash
mkdir -p data public/uploads
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start

# Or run on port 80 (requires admin privileges)
npm run start:80
```

## Project Structure

```
sunidhi-nextjs/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── about/               # About section pages
│   │   ├── admin/               # Admin dashboard pages
│   │   ├── api/                 # API routes
│   │   │   ├── admin/          # Admin API endpoints
│   │   │   ├── analytics/      # Analytics tracking
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── market-news/    # Market news API & webhook
│   │   │   ├── fetch-market-news/ # RSS feed fetcher
│   │   │   └── ...             # Other API routes
│   │   ├── markets/            # Markets & research pages
│   │   │   └── news/           # Real-time market news page
│   │   ├── services/           # Service pages
│   │   ├── support/            # Support pages
│   │   ├── tools/              # Calculator tools
│   │   ├── login/              # Login page
│   │   ├── open-account/       # Account opening
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   └── ui/                 # Reusable UI components
│   └── lib/
│       └── utils.ts            # Utility functions
├── data/                        # Data storage (gitignored)
│   └── market-news.json        # Market news cache
├── public/                      # Static assets
│   └── uploads/                # User uploaded files (gitignored)
├── .env.local                   # Environment variables (gitignored)
├── .env.local.example          # Example env file
├── .gitignore                  # Git ignore rules
├── CHANGELOG.md                # Version history
├── PROJECT_SUMMARY.md          # Project overview
├── README.md                   # This file
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration

```

## Design System

### Colors
- **Primary Blue**: #3B82F6 (trust, professionalism)
- **Secondary Green**: #10B981 (growth, success)
- **Accent Orange**: #F97316 (CTAs, energy)
- **Neutrals**: Gray scale from 50 to 900

### Typography
- **Font Family**: Inter (system fallback)
- **Headings**: Bold, large sizes
- **Body**: Regular weight, readable sizes

### Components
All components are built with:
- Consistent spacing
- Hover states
- Focus states (accessibility)
- Responsive breakpoints
- Reusable props

## Key Components

### Layout Components
- `Header` - Sticky navigation with dropdowns
- `Footer` - Multi-column footer with links
- `Container` - Max-width container wrapper

### UI Components
- `Button` - Multiple variants and sizes
- `Card` - Flexible card component
- Interactive forms and inputs

## Production Deployment

### Deployment Platforms

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

Environment variables to set in Vercel dashboard:
- `JWT_SECRET`
- `ADMIN_PASSWORD`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`

#### Option 2: Traditional Server (VPS/Dedicated)
```bash
# Build the application
npm run build

# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start npm --name "sunidhi-website" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

Configure nginx as reverse proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Certificate (Production)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com
```

### Post-Deployment Checklist
- [ ] Set all environment variables
- [ ] Create `data` and `public/uploads` directories
- [ ] Configure email SMTP settings
- [ ] Test authentication flow
- [ ] Verify market news RSS feeds are working
- [ ] Check all forms (contact, feedback, career applications)
- [ ] Run security audit
- [ ] Set up monitoring (error tracking, uptime monitoring)
- [ ] Configure backups for data directory
- [ ] Test on multiple devices and browsers

## Active Integrations

### ✅ Implemented and Working
1. **JWT Authentication** - Secure user and admin authentication
2. **Market News** - Real-time RSS feed integration from 7+ sources
3. **Email Service** - Contact forms and notifications via Nodemailer
4. **CMS** - Admin dashboard for content management
5. **Analytics** - Visit tracking system
6. **Blog System** - Dynamic blog posts with SEO
7. **Document Management** - File uploads and downloads

### 🔄 Ready for Enhancement
1. **Market Data APIs** - Structure ready for NSE/BSE real-time data
2. **IPO Data** - Page ready for live IPO information
3. **Branch Locator** - Ready for Google Maps integration
4. **Payment Gateway** - Account opening flow ready for payment integration
5. **Trading Platform** - Integration points identified

## Customization

### Updating Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: { ... },
  secondary: { ... },
  accent: { ... }
}
```

### Adding New Pages
1. Create new folder in `src/app/`
2. Add `page.tsx` file
3. Update navigation in `Header.tsx`

### Modifying Components
All components are in `src/components/` and can be customized independently.

## Performance

- Server-side rendering for initial page load
- Optimized images (when using Next.js Image component)
- Code splitting by route
- Minimal JavaScript bundle

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

### Making Changes

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "Description of changes"
```

3. Push to remote:
```bash
git push origin feature/your-feature-name
```

### Update CHANGELOG.md

When making significant changes, update `CHANGELOG.md`:
```markdown
## [Version] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Modified feature description

### Fixed
- Bug fix description
```

## Future Enhancements

### Planned Features
1. **Database Integration** - PostgreSQL with Prisma for persistent storage
2. **Real-time Market Data** - NSE/BSE API integration
3. **Payment Gateway** - Razorpay/PayU integration for account activation
4. **Advanced Analytics** - Google Analytics 4 integration
5. **Error Monitoring** - Sentry integration
6. **Mobile Apps** - React Native apps (iOS/Android)
7. **AI Chatbot** - Customer support automation
8. **Video KYC** - Integrated video verification
9. **Testing Suite** - Jest unit tests + Playwright E2E tests
10. **Multi-language Support** - i18n implementation

## License

Private - Sunidhi Securities & Finance Limited

## Contact

For support or queries, contact:
- Email: info@sunidhi.com
- Phone: +91-123-456-7890
