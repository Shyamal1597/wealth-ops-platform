# Changelog

All notable changes to the Sunidhi Securities & Finance Limited website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.5] - 2026-01-21 - Registration Flow & Daily Updates Fixes

### Fixed
- **Daily Updates Navigation** (`/markets/daily-updates`)
  - Fixed critical route mismatch in header navigation
  - Navigation link was pointing to `/markets/updates` but actual page was at `/markets/daily-updates`
  - Corrected link in Header component to resolve "page crash" issue
  - All 54 Morning Buzz reports now display correctly

### Changed
- **Registration Form** (`/register`)
  - **Streamlined Registration Flow**: Reduced from 4 steps to 3 steps
    - Old flow: Details → Phone → OTP → Success
    - New flow: Details → OTP → Success
  - **Phone Number Field**: Moved phone input to first screen (Details step)
    - Users now enter phone number along with other details
    - Removed separate phone verification step
    - OTP is sent immediately after form validation
  - **Removed Account Type Field**: Eliminated account type selection from registration
    - Field was deemed unnecessary for the registration process
    - Simplified user experience
  - **Updated Progress Indicator**: Modified to reflect 3-step process instead of 4

### Added
- **Firebase Setup Documentation** (`FIREBASE_SETUP_INSTRUCTIONS.md`)
  - Comprehensive step-by-step guide for Firebase configuration
  - Instructions for creating Firebase project and enabling Phone Authentication
  - Detailed environment variable setup for `.env.local`
  - Configuration examples for Firebase web app
  - Troubleshooting section for common Firebase errors
  - Security best practices and notes

- **Admin Research Upload Enhancement** (`/admin/research`)
  - Added report type selector with radio buttons
  - Allows admin to choose between "Research Report" and "Daily Update (Morning Buzz)"
  - Reports are automatically routed to correct data file:
    - Research Reports → `data/research-reports.json`
    - Daily Updates → `data/daily-updates.json`
  - Maintains separation between research content and daily market updates

### Technical Improvements
- Enhanced error handling for Firebase authentication flows
- Improved state management in registration component
- Streamlined form validation and OTP sending process
- Better UX with combined validation and OTP trigger
- Cleaner component architecture with reduced step complexity

---

## [1.0.4] - 2026-01-09 - Mutual Funds Section

### Added
- **Mutual Funds Page** (`/services/mutual-funds`)
  - Comprehensive mutual funds marketplace page showcasing 1,579 schemes
  - Complete list of 42+ Asset Management Companies (AMCs) organized alphabetically:
    - Aditya Birla Sun Life, Axis, Bajaj Finserv, Bandhan, Bank of India, Baroda BNP Paribas
    - Canara Robeco, DSP, Edelweiss, Franklin Templeton, Groww, HDFC, Helios, HSBC
    - ICICI Prudential, Invesco, ITI, JM Financial, Kotak Mahindra, LIC
    - Mahindra Manulife, Mirae Asset, Motilal Oswal, Navi, Nippon India, NJ, Old Bridge
    - PGIM India, PPFAS, Quant, Quantum, Samco, SBI, Shriram, Sundaram
    - Tata, Taurus, Union, UTI, WhiteOak Capital, Zerodha, 360 ONE
  - Each AMC card displays company name and fund count
  - Hero section highlighting 1,579 schemes from 42+ AMCs
  - 4 key features: Wide Fund Selection, Expert Guidance, Secure Platform, Zero Commission
  - 10 benefits checklist (SIP from ₹500, lumpsum options, KYC verification, NAV updates, etc.)
  - Fund category filters: All Funds (1579), Equity (650), Debt (450), Hybrid (280), ELSS (85), Index (114)
  - Search functionality to filter AMCs by name
  - "How to Invest" section with 4-step process
  - 10-question comprehensive FAQ section covering:
    - Fund offerings and minimum investment amounts
    - Charges and commission structure
    - Investment process (SIP vs Lumpsum)
    - Safety and risk factors
    - Portfolio tracking and switching
    - ELSS tax-saving benefits
    - Redemption timelines
  - Regulatory disclaimer section
  - Multiple CTAs for account opening and advisor consultation
  - Added "Mutual Funds" link to Expertise navigation menu in Header

---

## [1.0.3] - 2026-01-08 - MTF Page, Blog Admin, and Calculator Improvements

### Added
- **Margin Trading Facility (MTF) Page** (`/expertise/mtf`)
  - Comprehensive MTF product page with hero section and gradient background
  - "What is MTF" educational section with visual 3-step diagram (You Pay → We Fund → You Get)
  - 6 feature cards highlighting Enhanced Buying Power, Flexible Funding, Extended Holding, Security, Stock Selection, and Instant Activation
  - Benefits checklist with 6 key advantages
  - 5-step activation process with numbered cards
  - 8-question FAQ accordion with controlled expand/collapse
  - Risk warning disclaimer section with regulatory compliance messaging
  - Multiple CTAs linking to account opening and contact pages
  - Added MTF navigation link in Header component under Expertise menu

- **Blog Management Admin Interface** (`/admin/blogs`)
  - Dedicated admin page for creating, editing, and deleting blog posts
  - Form with auto-slug generation from title
  - Rich content support with markdown textarea
  - Image URL input for featured images
  - Category and tags management (comma-separated)
  - Featured blog toggle option
  - Preview blogs in new tab functionality
  - Authentication protection with session storage checks
  - 401 status handling with automatic redirect to login

### Changed
- **Brokerage Calculator** (`/tools/brokerage-calculator`)
  - **Terminology Update**: Changed all "Square-off" references to "Intraday" across the calculator
    - Updated state types from `"square-off"` to `"intraday"`
    - Updated button labels and UI text
    - Updated validation messages
  - **Uniform Display**: Modified result display to always show "Net Proceeds" instead of inconsistent "Breakeven Price"
    - Buy-only scenario: Shows net cost as negative Net Proceeds
    - Sell-only scenario: Shows net proceeds as positive Net Proceeds
    - Buy + Sell scenario: Shows net P&L with breakeven separately
  - **Complete Redesign**: Removed "AI slop" appearance with minimalist makeover
    - Removed flashy gradients from buttons and cards
    - Removed animated icons and fancy effects
    - Simplified to clean red/gray/white color scheme matching website palette
    - Standard border/rounded inputs instead of gradient containers
    - Professional, clean layout suitable for financial services
    - Simple segment buttons with red primary color for active state
    - Clean result cards with gray backgrounds instead of gradients

### Fixed
- **Brokerage Calculator Charges**: Verified all charges are correctly implemented
  - Stamp duty: 0.015% on buy side (equity delivery), 0.002% on sell side (equity intraday/F&O)
  - Exchange transaction charges: 0.00325% NSE, 0.00375% BSE
  - STT: 0.1% on sell side (delivery), 0.025% both sides (intraday), 0.0625% sell side (F&O), 0.002% (commodity)
  - SEBI charges: ₹10 per crore
  - GST: 18% on (brokerage + exchange charges + SEBI charges)
  - All calculations verified against provided charge structure tables

### Technical Improvements
- Enhanced authentication flow for admin pages with proper 401 handling
- Improved state management for FAQ accordion component
- Clean component architecture for MTF page sections
- Responsive design across all new components

---

## [1.0.2] - 2024-12-30 - Market Overview Removal

### Removed
- **Market Overview Page** (`/markets/overview`)
  - Removed entire Market Overview section due to compliance requirements
  - Deleted `/markets/overview/page.tsx` and associated directory
  - Removed "Market Overview" navigation link from Header component
  - Removed "Market Overview" entry from search page index
  - This feature cannot be displayed due to regulatory compliance constraints

### Changed
- Updated navigation menu to exclude Market Overview option
- Search functionality no longer indexes Market Overview page

---

## [1.0.1] - 2024-12-30 - Market News Search Improvements

### Fixed
- **Market News Search Functionality** (`/markets/news`)
  - Fixed duplicate React key warnings by implementing full base64 hash IDs instead of truncated 32-character IDs
  - Resolved search display issue where filtered results weren't rendering correctly
  - Enhanced search to comprehensively search across title, source, AND content fields
  - Increased news loading from 50 to 200 items for complete dataset searching
  - Fixed state initialization bug where filteredNews wasn't populating on page load
  - Implemented array spreading technique to force React re-renders when search results change
  - Added unique component keys to news grid and cards for proper React reconciliation

### Changed
- **Search Behavior**
  - Search now returns results matching keywords in article titles, source names, or content
  - Results are intelligently ranked: title matches first, then source matches, then content matches
  - Search placeholder updated to "Search news by title, source, or keywords..." for clarity
  - Clearing search now properly restores all 200 news articles

### Technical Improvements
- ID Generation: Changed from `substring(0, 32)` to full `toString('base64').replace(/[/+=]/g, '_')`
- API Data Limit: Increased from `limit=50` to `limit=200` in `/api/market-news` calls
- Search Algorithm: Enhanced filter logic with proper state management and re-render optimization
- Component Keys: Added dynamic keys based on filtered content length to ensure proper updates

---

## [1.0.0] - 2024-12-30 - Initial Production Release

### Overview
Complete rebuild of the Sunidhi Securities & Finance Limited website using modern web technologies. This marks the transition from static pages to a fully functional, dynamic website with real-time market data integration.

---

## Phase 1: Foundation & Core Pages (December 2024)

### Added - Core Infrastructure
- **Next.js 15.1.0** with App Router for modern routing and server-side rendering
- **React 18.3.1** for component-based UI development
- **TypeScript 5.7.2** for type-safe development
- **Tailwind CSS 3.4.15** for utility-first styling
- Custom design system with brand colors (Primary Blue, Growth Green, Energy Orange)
- Responsive layouts for mobile, tablet, and desktop
- Component-based architecture for maintainability

### Added - Layout Components
- **Header Component** (`src/components/layout/Header.tsx`)
  - Sticky navigation with dropdown menus
  - Mobile-responsive hamburger menu
  - Top bar with company highlights (58+ years, 100+ locations, 50,000+ clients)
  - Quick access to Login and Open Account

- **Footer Component** (`src/components/layout/Footer.tsx`)
  - Comprehensive multi-column layout
  - Company information and social links
  - Quick links to all pages
  - Contact information
  - Regulatory disclaimer

### Added - UI Component Library
- Button component with multiple variants (default, secondary, outline, ghost, link)
- Card components (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- Container component for consistent max-width layouts
- Utility functions for className merging

### Added - Homepage (`/`)
- Hero section with compelling tagline and CTAs
- Trust indicators section
- Services overview with 6 service cards
- Why Choose Us section
- Quick actions (Open Account, Calculators, Research)
- Latest updates section
- Final CTA section

### Added - Service Pages
1. **Equity Trading** (`/services/equity-trading`)
   - Feature list and benefits
   - Trading platforms overview
   - Market access details
   - Research and support information

2. **Derivatives & Commodities** (`/services/derivatives`)
   - F&O trading information
   - Commodity trading details
   - Advanced tools description

3. **Debt Market** (`/services/debt-market`)
   - Bond investment options
   - Benefits of debt instruments

4. **Foreign Exchange** (`/services/foreign-exchange`)
   - Currency trading information
   - Major currency pairs

5. **Insurance** (`/services/insurance`)
   - Life, Health, and General insurance
   - Product categories

6. **Wealth Management** (`/services/wealth-management`)
   - Portfolio management services
   - Financial planning offerings

### Added - Markets & Research Pages
1. **Market Overview** (`/markets/overview`)
   - Market indices display
   - Top gainers and losers
   - Real-time data structure

2. **Research Reports** (`/markets/research`)
   - Downloadable report cards
   - CMS-ready structure

3. **Daily Updates** (`/markets/updates`)
   - News and market updates
   - Timestamp display

4. **IPO Center** (`/markets/ipo`)
   - Current IPO listings
   - Application functionality placeholders

5. **Educational Resources** (`/markets/education`)
   - Trading basics
   - Video tutorials
   - Financial glossary

### Added - Interactive Calculator Tools
1. **Margin Calculator** (`/tools/margin-calculator`)
   - Real-time margin calculation
   - Interactive form inputs

2. **Brokerage Calculator** (`/tools/brokerage-calculator`)
   - Detailed charge breakdown
   - STT, transaction charges, GST calculation
   - Net P&L display

3. **SIP Calculator** (`/tools/sip-calculator`)
   - Monthly investment calculator
   - Visual breakdown of returns
   - Compound interest calculation

4. **Tax Calculator** (`/tools/tax-calculator`)
   - STCG and LTCG tax information
   - Tax rate display

### Added - About Pages
1. **Our Story** (`/about/story`)
   - Company history and heritage
   - Core values (Integrity, Client First, Excellence)
   - Current presence information

2. **Leadership** (`/about/leadership`)
   - Leadership team profiles
   - Executive bios

3. **Awards & Recognition** (`/about/awards`)
   - Timeline of achievements
   - Industry recognitions

4. **Sunidhi Foundation** (`/about/foundation`)
   - CSR initiatives
   - Education, Healthcare, Environment programs

5. **Careers** (`/about/careers`)
   - Career opportunities
   - Job listings
   - Application system

### Added - Support Pages
1. **Help Center** (`/support/help`)
   - Comprehensive FAQs
   - Categorized by topic
   - Account, trading, and technical support

2. **Contact Us** (`/support/contact`)
   - Interactive contact form
   - Office addresses
   - Multiple contact methods
   - Business hours

3. **Branch Locator** (`/support/branches`)
   - Branch listings
   - Search functionality
   - Maps integration ready

4. **Downloads & Forms** (`/support/downloads`)
   - Document library
   - Account opening forms
   - KYC documents
   - Trading guides

### Added - Account Management
1. **Open Account** (`/open-account`)
   - Three account types (eKYC, Offline, NRI)
   - Benefits highlighted
   - Document requirements
   - Multi-step wizard structure

2. **Login** (`/login`)
   - Login form
   - Remember me option
   - Forgot password link
   - Authentication ready

---

## Phase 2: Dynamic Features & Backend Integration (December 2024)

### Added - Authentication System
- **JWT-based authentication** (`jsonwebtoken` v9.0.3)
- **Password hashing** with bcryptjs (v3.0.3)
- **Cookie-based session management** (v1.1.1)
- API routes for login, register, and logout
- Admin authentication system
- Protected routes structure

### Added - Real-time Market News System
- **RSS Feed Integration** (`rss-parser` v3.13.0)
  - LiveMint market news
  - Economic Times business section
  - The Hindu Business Line
  - Times of India business
  - MarketWatch (global)
  - CNBC financial news
  - Financial Times markets

- **Market News Page** (`/markets/news/page.tsx`)
  - Real-time news aggregation
  - Multi-source filtering
  - Search functionality (title and source)
  - Auto-refresh every 5 minutes (display)
  - Auto-fetch from RSS feeds every 30 minutes
  - Image thumbnails with fallback
  - Relative timestamps (e.g., "5m ago", "2h ago")
  - Responsive card layout
  - External link handling

- **News API Endpoints**
  - `POST /api/market-news` - Webhook receiver for n8n integration
  - `GET /api/market-news` - Retrieve filtered news with pagination
  - `GET /api/fetch-market-news` - Manual RSS feed refresh trigger
  - Automatic duplicate detection using URL-based IDs
  - Source extraction from URLs
  - Content sanitization

- **Data Persistence**
  - JSON file-based storage (`/data/market-news.json`)
  - Automatic cleanup (keeps latest 200 items)
  - Chronological sorting (newest first)

### Added - Content Management System (CMS)
- Admin dashboard for content management
- API routes for managing:
  - Research reports (upload, edit, delete)
  - Career postings
  - Awards and recognition
  - Leadership profiles
  - Company timeline
  - CSR/Foundation initiatives
  - Blog posts
  - Life at Sunidhi images

### Added - Email Integration
- **Nodemailer** (v7.0.11) for email services
- Contact form email delivery
- Feedback form submissions
- Career application notifications

### Added - Document Management
- **DOCX generation** (`docx` v9.5.1) for report generation
- File upload handling for admin
- Document storage structure
- Public download endpoints

### Added - Analytics & Monitoring
- Visit tracking API (`/api/analytics/visit`)
- Admin analytics dashboard
- Feedback collection system

### Added - Blog System
- Dynamic blog posts with slug-based routing
- Rich content support
- Category filtering
- Publication date management
- SEO-optimized blog structure

---

## Technical Improvements

### Performance Optimizations
- Server-side rendering (SSR) for SEO
- Code splitting by route
- Optimized bundle sizes
- Efficient React re-renders
- Image optimization ready (Next.js Image component structure)

### Accessibility
- Semantic HTML5 elements
- ARIA labels where appropriate
- Keyboard navigation support
- Focus visible states
- WCAG-compliant color contrast

### SEO Enhancements
- Metadata in layout.tsx
- Descriptive page titles
- Semantic heading hierarchy
- Clean URL structure
- Sitemap ready
- OpenGraph tags structure

### Security
- Environment variable management (.env.local)
- Password hashing with bcrypt
- JWT token security
- CSRF protection ready
- Content Security Policy headers ready
- HTTPS enforcement structure

### Developer Experience
- TypeScript for type safety
- ESLint configuration
- Clear component structure
- Modular architecture
- Comprehensive documentation
- Code comments where needed

---

## Dependencies Added

### Production Dependencies
```json
{
  "autoprefixer": "^10.4.22",
  "bcryptjs": "^3.0.3",
  "cheerio": "^1.1.2",
  "clsx": "^2.1.1",
  "cookie": "^1.1.1",
  "docx": "^9.5.1",
  "jsonwebtoken": "^9.0.3",
  "lucide-react": "^0.460.0",
  "next": "^15.1.0",
  "nodemailer": "^7.0.11",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "rss-parser": "^3.13.0",
  "tailwind-merge": "^2.5.5"
}
```

### Development Dependencies
```json
{
  "@types/bcryptjs": "^2.4.6",
  "@types/cookie": "^0.6.0",
  "@types/jsonwebtoken": "^9.0.10",
  "@types/node": "^22.10.1",
  "@types/nodemailer": "^7.0.4",
  "@types/react": "^18.3.12",
  "@types/react-dom": "^18.3.1",
  "eslint": "^9.16.0",
  "eslint-config-next": "^15.1.0",
  "postcss": "^8.4.49",
  "tailwindcss": "^3.4.15",
  "typescript": "^5.7.2"
}
```

---

## Known Issues & Future Improvements

### Current Known Issues
- None - All critical issues have been resolved ✅

### Recently Resolved (v1.0.1)
- ✅ **React Key Warning**: Fixed duplicate keys in market news component
  - Solution: Implemented full base64 hash IDs with character sanitization
- ✅ **Market News Search**: Fixed search not displaying relevant results
  - Solution: Enhanced search algorithm and state management

### Planned Future Enhancements
- [ ] Real-time market data API integration (NSE, BSE)
- [ ] Trading platform integration
- [ ] Mobile apps (iOS/Android)
- [ ] Push notification system
- [ ] Video KYC integration
- [ ] Payment gateway integration
- [ ] Advanced portfolio analytics
- [ ] AI-powered chatbot for customer support
- [ ] Multi-language support
- [ ] Dark mode theme

---

## File Structure

```
sunidhi-nextjs/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── about/               # About section pages
│   │   ├── api/                 # API routes
│   │   │   ├── admin/          # Admin API endpoints
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── market-news/    # Market news API
│   │   │   └── ...
│   │   ├── markets/            # Markets & research pages
│   │   │   └── news/           # Real-time market news
│   │   ├── services/           # Service pages
│   │   ├── support/            # Support pages
│   │   ├── tools/              # Calculator tools
│   │   └── ...
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   └── ui/                 # Reusable UI components
│   └── lib/
│       └── utils.ts            # Utility functions
├── data/                        # Data storage (gitignored)
│   └── market-news.json        # Market news cache
├── public/                      # Static assets
│   └── uploads/                # Uploaded files
├── .env.local                   # Environment variables (gitignored)
├── .gitignore                  # Git ignore rules
├── CHANGELOG.md                # This file
├── PROJECT_SUMMARY.md          # Project overview
├── README.md                   # Documentation
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Deployment Information

### Production Ready
The application is ready for deployment to:
- **Vercel** (recommended)
- **Netlify**
- **Traditional hosting** (with Node.js support)

### Environment Variables Required
```
JWT_SECRET=<your-jwt-secret>
ADMIN_PASSWORD=<hashed-admin-password>
EMAIL_HOST=<smtp-host>
EMAIL_PORT=<smtp-port>
EMAIL_USER=<email-username>
EMAIL_PASS=<email-password>
```

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

---

## Contributors

**Development Team**: Sunidhi Securities Development Team
**Project Start**: December 2024
**Initial Release**: December 30, 2024
**Status**: Production Ready ✅

---

## License

Private - Sunidhi Securities & Finance Limited
All rights reserved.
