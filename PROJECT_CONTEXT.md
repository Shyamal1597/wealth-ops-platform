# Sunidhi Website - Project Context & History

**Last Updated**: December 18, 2025
**Project**: Sunidhi Securities & Finance Limited Website
**Technology**: Next.js 15.5.9 (App Router), React, TypeScript, Tailwind CSS
**Location**: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs`

---

## Quick Start

- **Development Server**: `npm run dev` → http://localhost:3000
- **Build**: `npm run build`
- **Total Pages**: 51 static pages
- **Color Scheme**: Ferrari Red (#FF0000, #DC0000) and Black (#000000)

---

## Project Overview

A corporate website for Sunidhi Securities & Finance Limited, a stock brokerage and financial services company with 58 years of history, 100+ locations, and 50,000+ clients.

### Key Business Information
- **Founded**: 1960s by Late Jasvantlal Parekh, Late Jayantilal Shah, and Late Dhirajlal Parekh
- **Current Leadership**: Arun Shah, Jayesh Parekh, Bimal Parekh, Rishabh Parekh
- **Services**: Stock broking, commodity trading, forex, debt market, mutual funds, depository services, NBFC
- **Registrations**:
  - SEBI Stock Exchanges: INZ000169235 (BSE/NSE/MSEI/MCX/NCDEX)
  - CDSL DP: IN-DP 410-2019
  - Research Analyst: INH000001329
  - FEDAI Member

---

## Important Project Decisions & User Preferences

### 1. Color Scheme - Ferrari Red & Black (CRITICAL)
**Date**: Session 3-4
**User Request**: "remove the gradient present on the red background on the website. Also make it a combination of black and ferrari red."

**Implementation**:
- Primary Colors: `#FF0000` (primary-500), `#DC0000` (primary-600), `#B30000` (primary-700)
- All gradients removed - replaced with solid `bg-black`
- Header top bar: `bg-primary-600` (Ferrari Red)
- Hero sections: `bg-black` with white text
- Accent color for icons, buttons, borders: Ferrari Red

**What to AVOID**:
- ❌ NO gradients (e.g., `bg-gradient-to-r from-primary-600 to-primary-800`)
- ❌ NO `bg-primary-50` or `bg-primary-100` (renders as light pink)
- ❌ NO `text-primary-100` on dark backgrounds (use `text-white` instead)

**Correct Patterns**:
- ✅ Hero sections: `bg-black text-white`
- ✅ Download/info boxes: `bg-gray-50 border-gray-300`
- ✅ Icon circles: `bg-white border-2 border-primary-600`
- ✅ Buttons: `bg-primary-600 text-white hover:bg-primary-700`

### 2. Menu Structure Changes
**Date**: Session 1
**Change**: "Services" → "Expertise"
- User wanted the main navigation menu item changed from "Services" to "Expertise"
- All submenus remain the same, only the top-level label changed

### 3. Homepage Carousel Size
**Date**: Session 4
**User Request**: "image carousel on the homepage looks a bit smaller. Can you make the images a bit bigger and the box below a bit shorter."

**Implementation**:
- Carousel height increased: `h-[500px] md:h-[650px]` (was `h-[400px] md:h-[500px]`)
- Navigation dots: smaller (`w-2.5 h-2.5`, closer to bottom `bottom-3`)
- "Our Story" section padding reduced: `py-12` (was `py-16`)

### 4. Legal Section - Menu & Pages
**Date**: Session 2-3
**User Request**: "Create one more Tab Legal and under which include submenus"

**Pages Created** (with PDF downloads):
1. **Privacy Policy** (`/legal/privacy-policy`)
2. **Disclosure & Disclaimer** (`/legal/disclosure-disclaimer`)
   - PDF: `SUNIDHI_DISCLAIMER_WEBSITE_Final_Aug_11_2023.pdf`
3. **Regulatory Information** (`/legal/regulatory-information`)
4. **Advisory - KYC Compliance** (`/legal/kyc-advisory`)
   - PDF: `Annexure-I-Advisory-for-KYC-updation.pdf`
5. **Investor Charter** (`/legal/investor-charter`)
   - 3 PDFs with subsections (DP, Research Analyst, Investor Complaints)

### 5. NBFC Contact Information
**Date**: Session 1
**Added**: Sunidhi Capital Pvt Ltd (NBFC) contact details in Contact page
- For queries: (+91-22) 66771777, support@sunidhi.com
- Grievance Officer: Nikhil Rasal, nikhil.r@sunidhi.com

---

## File Structure

### Key Directories
```
sunidhi-nextjs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # 7 pages (story, leadership, careers, etc.)
│   │   ├── expertise/         # 10 pages (retail-equity, commodities, etc.)
│   │   ├── legal/             # 5 pages (NEW - privacy, disclosure, etc.)
│   │   ├── markets/           # 4 pages (overview, research, updates, education)
│   │   ├── support/           # 4 pages (help, contact, downloads, branches)
│   │   ├── tools/             # 4 pages (calculators)
│   │   ├── api/               # API routes (news, research)
│   │   └── layout.tsx         # Root layout with Header/Footer
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   └── ui/                # Reusable components (Button, Card, Container, MarqueeBanner)
│   └── lib/
│       └── constants.ts       # HOME_BANNERS array
├── public/
│   ├── images/                # All images (banners, team photos, etc.)
│   └── legal-documents/       # PDF files for Legal section
└── tailwind.config.ts         # Color configuration
```

### Important Files

**Configuration**:
- `next.config.ts` - Next.js configuration (NO static export due to API routes)
- `tailwind.config.ts` - Ferrari Red color palette defined here
- `src/app/globals.css` - Custom animations (timeline-marquee)

**Layout Components**:
- `src/components/layout/Header.tsx` - Navigation with 6 dropdowns (Expertise, Markets, Tools, About, Legal, Support)
- `src/components/layout/Footer.tsx` - Multi-column footer with links
- `src/components/ui/MarqueeBanner.tsx` - Homepage image carousel (4-second rotation)

**Search**:
- `src/app/search/page.tsx` - Site-wide search with all 51+ pages indexed

---

## Known Issues & Fixes

### Issue 1: PDF Downloads Not Working on IIS
**Problem**: PDFs don't download when site accessed via http://localhost (IIS port 80)
**Root Cause**: IIS serves from `C:\inetpub\wwwroot`, not from Next.js project folder
**Solution**: Use `http://localhost:3000` for development (Next.js dev server)
**Alternative**: Copy PDFs to `C:\inetpub\wwwroot/legal-documents/` (requires admin) - scripts created:
- `COPY_PDFS_TO_IIS.ps1` (PowerShell)
- `COPY_PDFS_TO_IIS.bat` (Batch file)

### Issue 2: IIS Reverse Proxy Configuration
**Status**: Not configured (requires admin privileges and IIS URL Rewrite module)
**Files Created**:
- `IIS-web.config` - Configuration for IIS reverse proxy
- `SETUP_IIS_PROXY.bat` - Setup script (requires admin)
- `FIX_LOCALHOST_ISSUE.md` - Detailed instructions

**Current Setup**:
- ✅ Development: http://localhost:3000 (Next.js) - **RECOMMENDED**
- ❌ IIS on port 80: Not configured for reverse proxy

### Issue 3: About Section CSS Rendering
**Fixed**: December 18, 2025
**Problems Found**:
- Icon backgrounds using `bg-primary-100` (light pink) instead of white/borders
- Subtitle text using `text-primary-100` (light pink) instead of white
- Gradient backgrounds in "Fun @ Work" section (Life at Sunidhi page)

**All Fixed In**:
- `/src/app/about/foundation/page.tsx`
- `/src/app/about/life-at-sunidhi/page.tsx`
- `/src/app/about/story/page.tsx`
- `/src/app/about/leadership/page.tsx`
- `/src/app/about/careers/page.tsx`
- `/src/app/about/awards/page.tsx`
- `/src/app/about/csr/page.tsx`

---

## Common Patterns & Code Standards

### Hero Section Pattern
```tsx
<section className="bg-black text-white py-16">
  <Container>
    <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Title</h1>
    <p className="text-xl text-white">Subtitle here</p>
  </Container>
</section>
```

### PDF Download Box Pattern
```tsx
<Card className="bg-gray-50 border-gray-300">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <FileText className="h-10 w-10 text-primary-600" />
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Document Name</h3>
          <p className="text-sm text-gray-600">Description</p>
        </div>
      </div>
      <a
        href="/legal-documents/filename.pdf"
        download
        className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
      >
        <Download className="h-5 w-5" />
        Download PDF
      </a>
    </div>
  </CardContent>
</Card>
```

### Icon Circle Pattern
```tsx
<div className="bg-white border-2 border-primary-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
  <Icon className="h-10 w-10 text-primary-600" />
</div>
```

---

## Navigation Structure

### Main Menu (Header)
1. **Expertise** (10 items)
   - Retail Equity, Institution Equity, Commodities Trading, Foreign Exchange
   - Wholesale Debt Market, Retail Debt Market, Mutual Fund Distribution
   - Depository Services, Research, Sunidhi Capital (NBFC)

2. **Markets & Research** (5 items)
   - Market Overview, Research Reports, Daily Updates
   - IPO Center (external: https://ipo.meon.co.in/sunidhi)
   - Educational Resources

3. **Tools** (2 items)
   - Brokerage Calculator, Tax Calculator

4. **About** (7 items)
   - Our Story, Leadership, Life at Sunidhi
   - Awards & Recognition, CSR, Sunidhi Foundation, Careers

5. **Legal** (5 items)
   - Privacy Policy, Disclosure & Disclaimer
   - Regulatory Information, Advisory - KYC Compliance, Investor Charter

6. **Support** (4 items)
   - Help Center, Contact Us, Downloads & Forms

---

## Build & Deployment Notes

### Build Command
```bash
npm run build
```

**Build Stats**:
- Total Pages: 51 static pages
- Dynamic API Routes: 2 (`/api/news`, `/api/research`)
- One ESLint Warning: React Hook useEffect dependency in `/src/app/markets/research/page.tsx:25` (non-blocking)

### Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Static Assets
- Images: `/public/images/` (banners, team photos, foundation photos, etc.)
- PDFs: `/public/legal-documents/` (5 PDF files)
- Logo: `/public/images/Sunidhi_logo_homepage.png`

---

## PDF Files Reference

### Location in Project
`C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\public\legal-documents\`

### Files (5 total)
1. `SUNIDHI_DISCLAIMER_WEBSITE_Final_Aug_11_2023.pdf` (395 KB)
2. `Annexure-I-Advisory-for-KYC-updation.pdf` (75 KB)
3. `Investor_charter_DP.pdf` (250 KB)
4. `Investor_Charter_in_respect_of_Research_Analyst_(RA).pdf` (155 KB)
5. `1679937760Investor_complaints_Depository_Participant_Sunidhi.pdf` (456 KB)
   - **Note**: Space removed from filename (was "Depository Participant", now "Depository_Participant")

### Access URLs (on localhost:3000)
- http://localhost:3000/legal-documents/[filename].pdf

---

## Images Used

### Homepage Banners (Carousel)
Defined in: `src/lib/constants.ts` → `HOME_BANNERS` array
- `/images/Home-banner1.jpg`
- `/images/building-landing-page.jpg`
- `/images/charts-on-laptop.jpg`
- `/images/globe.jpg`

### Leadership Team
- `/images/Arun-Shah.jpg`
- `/images/Bimal-Parekh.jpg`
- `/images/Jayesh-Parekh.jpg`
- `/images/Rishabh-Parekh.jpg`

### Timeline/History (Leadership page marquee)
- `/images/1-Sunidhi-Founders.jpg`
- `/images/2-Wholesale-Debt.jpg`
- `/images/3-Research.jpg`
- `/images/4-Forex.jpg`
- `/images/5-Retail-Equity.jpg`
- `/images/6-JV-with-JLT.jpg`
- `/images/7-Sunidhi-Capital.jpg`
- `/images/8-Commodities-min.jpg`
- `/images/9-Wealth-Management-min.jpg`
- `/images/10-Expansion-of-office.jpg`
- `/images/11-Awarded.jpg`

### Life at Sunidhi
- `/images/1-Life-at-Sunidhi-1.jpg`
- `/images/1-Work-Culture-1.jpg`
- `/images/2-Work-Culture-2.jpg`
- `/images/3-Work-Culture-3.jpg`

### Foundation
- `/images/180404-Sunidhi-Foundation_07.jpg`
- `/images/180404-Sunidhi-Foundation_09.jpg`

---

## Contact Information

### Main Office
**Sunidhi Securities & Finance Limited**
8th Floor, Kalpataru Inspire
Opp. Grand Hyatt Hotel
Santacruz (E), Mumbai - 400 055
CIN: U67190MH1985PLC037326

### Phone Numbers
- **Franchise/Client Enquiry**: 022-66771696 / 022-43222696
- **Online Trading**: 022-66771601 / 022-43222602
- **Client Queries**: 022-66771593 / 022-43222593
- **Depository (CDSL)**: 022-66771461 / 022-66771462

### Email Addresses
- **Franchise/AP/Client**: associate@sunidhi.com
- **Online Trading**: onlinetrading@sunidhi.com
- **Client Queries**: retailrm@sunidhi.com
- **Depository**: dp@sunidhi.com
- **Investor Grievances**: complaints.redressal@sunidhi.com

### NBFC (Sunidhi Capital)
- **Queries**: (+91-22) 66771777, support@sunidhi.com
- **Grievance Officer**: Nikhil Rasal, nikhil.r@sunidhi.com

### Escalation Matrix
- **Customer Care**: Hemant Sarmalkar, 022-66771777 Ext: 590
- **Head of Customer Care**: Avijit Kushari, 7045786888
- **Compliance Officer**: Mahesh S Desai, 022-66771777 Ext: 608

---

## Helper Scripts Created

### For PDF Management
1. **COPY_PDFS_TO_IIS.ps1** - PowerShell script to copy PDFs to IIS wwwroot (requires admin)
2. **COPY_PDFS_TO_IIS.bat** - Batch file alternative (requires admin)
3. **PDF_SETUP_INSTRUCTIONS.md** - Detailed instructions for PDF setup

### For IIS Configuration
1. **IIS-web.config** - IIS reverse proxy configuration file
2. **SETUP_IIS_PROXY.bat** - Setup script for IIS reverse proxy (requires admin)
3. **FIX_LOCALHOST_ISSUE.md** - Troubleshooting guide for localhost issues

### Documentation
1. **PROJECT_CONTEXT.md** - This file (comprehensive project context)

---

## Terms & Searches Performed

### Navigation Terms
- "Services" changed to "Expertise"
- "Legal" menu added with 5 subpages

### Color-Related Terms
- Ferrari Red: #FF0000, #DC0000
- Gradient removal: All `bg-gradient-to-r` replaced with `bg-black`
- `text-primary-100` → `text-white` (on dark backgrounds)
- `bg-primary-50` → `bg-gray-50` (for neutral backgrounds)
- `bg-primary-100` → `bg-white border-2 border-primary-600` (for icon circles)

### CSS Classes Searched
- `bg-gradient-to-r from-primary-600 to-primary-800`
- `text-primary-100`
- `bg-primary-50`
- `bg-primary-100`

### Files Modified
- All 44 page files with gradients
- 7 About section pages
- 5 Legal section pages
- Header.tsx (Legal menu added)
- tailwind.config.ts (Ferrari Red colors)
- MarqueeBanner.tsx (carousel size)
- search/page.tsx (Legal pages indexed)

---

## User's Communication Style

- Concise, direct requests
- Prefers immediate action over discussion
- Values working solutions quickly
- Comfortable with technical terms
- Expects fixes to be complete and thorough

---

## Next Steps / Potential Future Tasks

1. **Production Deployment**:
   - Configure IIS reverse proxy properly (requires URL Rewrite module)
   - OR deploy to a Node.js hosting service
   - OR export as static site (requires removing API routes)

2. **Content Updates**:
   - Update news/research via n8n webhooks (API routes configured)
   - Add more team members to Leadership page
   - Update Awards & Recognition as needed

3. **Feature Enhancements**:
   - Mobile responsiveness testing (already mobile-first design)
   - SEO optimization
   - Analytics integration
   - Contact form backend integration

---

## Important Reminders for Future Sessions

1. ✅ **ALWAYS use Ferrari Red (#FF0000, #DC0000) and Black color scheme**
2. ✅ **NO gradients anywhere**
3. ✅ **Use `text-white` for subtitles on black hero sections, NOT `text-primary-100`**
4. ✅ **For development, use http://localhost:3000, NOT http://localhost**
5. ✅ **PDF files are in `/public/legal-documents/` and served by Next.js**
6. ✅ **Total of 51 static pages + 2 dynamic API routes**
7. ✅ **Navigation has 6 main dropdowns: Expertise, Markets, Tools, About, Legal, Support**

---

**End of Project Context Document**
