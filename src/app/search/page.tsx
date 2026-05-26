'use client';

import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Search, FileText, ExternalLink } from 'lucide-react';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Define searchable content — PUBLIC pages only, no auth-gated content
  const searchablePages = [
    // Expertise
    { title: 'Retail Equity', href: '/expertise/retail-equity', description: 'Pioneers of online market trading in India — equity, commodity, internet, and currency trading.', keywords: 'equity trading stocks shares market buy sell demat nse bse online broker', category: 'Expertise' },
    { title: 'Institution Equity (Corporate)', href: '/expertise/institution-equity', description: 'Stringent research methodology for institutional investors, mutual funds, insurance companies, and banks.', keywords: 'institutional fii dii corporate bulk block deals mutual fund insurance bank hni', category: 'Expertise' },
    { title: 'Margin Trading Facility (MTF)', href: '/expertise/mtf', description: 'Leverage your trades with our Margin Trading Facility offering competitive funding rates.', keywords: 'margin mtf leverage funding pledge loan trading facility', category: 'Expertise' },
    { title: 'Commodities Trading', href: '/expertise/commodities-trading', description: 'Robust dealing desk for commodity trading including gold, silver, crude oil, and agricultural products.', keywords: 'commodity gold silver crude oil mcx ncdex copper zinc cotton agriculture', category: 'Expertise' },
    { title: 'Foreign Exchange', href: '/expertise/foreign-exchange', description: 'Interbank Forex trading for RBI-licensed dealers, FEDAI certified.', keywords: 'forex fx currency dollar euro yen pound exchange rate rbi fedai interbank', category: 'Expertise' },
    { title: 'Wholesale Debt Market', href: '/expertise/wholesale-debt-market', description: 'WDM trading, economic research, government securities, and money market instruments.', keywords: 'debt bonds gsec government securities treasury bills money market wdm fixed income', category: 'Expertise' },
    { title: 'Mutual Funds', href: '/services/mutual-funds', description: 'Explore our range of mutual fund products — SIP, lump sum, tax-saving ELSS, and more.', keywords: 'mutual fund sip systematic investment plan elss tax saving nav amc scheme lump sum', category: 'Expertise' },
    { title: 'Mutual Fund Distribution', href: '/expertise/mutual-fund-distribution', description: 'Professional mutual fund distribution with expert fund selection and portfolio advice.', keywords: 'mutual fund distributor advisor portfolio recommendation amc sip redemption', category: 'Expertise' },
    { title: 'Depository Services', href: '/expertise/depository-services', description: 'CDSL SEBI registered depository participant for secure digital holdings and dematerialisation.', keywords: 'depository cdsl demat dematerialisation holding shares transfer pledge dp participant', category: 'Expertise' },
    { title: 'Research', href: '/expertise/research', description: 'In-depth equity research with focus on mid-caps and absolute returns.', keywords: 'research analysis report recommendation buy sell target price midcap smallcap largecap', category: 'Expertise' },
    { title: 'Sunidhi Capital (NBFC)', href: '/expertise/sunidhi-capital', description: 'Capital solutions — loan against shares, personal loans, and business funding through our NBFC arm.', keywords: 'nbfc loan capital finance funding las loan against shares personal business', category: 'Expertise' },

    // About
    { title: 'Our Story', href: '/about/story', description: 'Over 65+ years of excellence in Indian financial services — our journey from 1957 to today.', keywords: 'history about sunidhi story journey founded 1957 heritage legacy', category: 'About' },
    { title: 'Leadership', href: '/about/leadership', description: 'Meet our experienced board of directors and senior management team.', keywords: 'leadership management board directors ceo chairman team', category: 'About' },
    { title: 'Life at Sunidhi', href: '/about/life-at-sunidhi', description: 'Discover what it\'s like to work at Sunidhi — our culture, values, and workplace.', keywords: 'life culture workplace values team employee work environment office', category: 'About' },
    { title: 'Awards & Recognition', href: '/about/awards', description: 'Our achievements and industry recognition over the years.', keywords: 'awards recognition achievements honours accolades industry', category: 'About' },
    { title: 'CSR & Foundation', href: '/about/csr', description: 'Corporate Social Responsibility initiatives and community engagement.', keywords: 'csr social responsibility community charity donation foundation ngo', category: 'About' },
    { title: 'Careers', href: '/about/careers', description: 'Explore career opportunities at Sunidhi Securities — current openings and how to apply.', keywords: 'careers jobs hiring vacancy opening apply resume recruitment intern fresher experienced', category: 'About' },

    // Markets & Research (public parts only)
    { title: 'Research Reports', href: '/markets/research', description: 'Access expert research reports and investment recommendations.', keywords: 'research reports analysis recommendation buy sell target quarterly annual sector stock', category: 'Markets' },
    { title: 'SIP Products', href: '/markets/sip-products', description: 'Managed stock-based SIP portfolios — Conservative, Moderate, and Aggressive strategies with monthly rebalancing.', keywords: 'sip product portfolio stock conservative moderate aggressive rebalancing monthly equity managed', category: 'Markets' },
    { title: 'Daily Updates', href: '/markets/daily-updates', description: 'Daily market commentary, news, and trading insights.', keywords: 'daily updates market news commentary nifty sensex today morning note', category: 'Markets' },
    { title: 'IPO Center', href: 'https://ipo.meon.co.in/sunidhi', description: 'Track upcoming IPOs, apply online, and check allotment status.', keywords: 'ipo initial public offering listing allotment apply gmp subscription', category: 'Markets' },
    { title: 'NSE RSS Feeds', href: '/markets/nse-rss', description: 'Real-time NSE announcements, circulars, and corporate actions.', keywords: 'nse rss feed news announcement circular corporate action dividend bonus split', category: 'Markets' },

    // Resources
    { title: 'Trading Holidays', href: '/resources/holidays', description: 'Complete list of stock exchange trading holidays for the current year.', keywords: 'holiday trading holiday nse bse mcx closed market off calendar', category: 'Resources' },
    { title: 'Settlement Calendar', href: '/resources/settlement-calendar', description: 'NSE and BSE settlement schedule and pay-in/pay-out dates.', keywords: 'settlement calendar payout pay-in t+1 t+2 delivery clearing', category: 'Resources' },

    // Tools
    { title: 'Brokerage Calculator', href: '/tools/brokerage-calculator', description: 'Calculate your brokerage charges, STT, stamp duty, and net profit/loss.', keywords: 'brokerage calculator charges commission stt stamp duty gst turnover tax', category: 'Tools' },
    { title: 'Tax Calculator', href: '/tools/tax-calculator', description: 'Calculate capital gains tax — short term and long term — on your investments.', keywords: 'tax calculator capital gains stcg ltcg income tax investment profit loss', category: 'Tools' },

    // Support
    { title: 'Help Center', href: '/support/help', description: 'Frequently asked questions, guides, and troubleshooting for all services.', keywords: 'help faq question answer guide how to troubleshoot support', category: 'Support' },
    { title: 'Contact Us', href: '/support/contact', description: 'Get in touch — phone numbers, email addresses, and office address.', keywords: 'contact phone email address office branch location customer care support helpline grievance complaint hemant sarmalkar avijit kushari mahesh desai escalation', category: 'Support' },
    { title: 'Downloads & Forms', href: '/support/downloads', description: 'Download KYC forms, account opening forms, and other documents.', keywords: 'download form kyc account opening modification closure demat poa cml', category: 'Support' },
    { title: 'Feedback', href: '/feedback', description: 'Share your feedback, suggestions, or complaints about our services.', keywords: 'feedback suggestion complaint review experience service quality', category: 'Support' },

    // Legal
    { title: 'Privacy Policy', href: '/legal/privacy-policy', description: 'Our privacy policy and how we protect your personal data.', keywords: 'privacy policy data protection personal information cookies gdpr', category: 'Legal' },
    { title: 'Disclosure & Disclaimer', href: '/legal/disclosure-disclaimer', description: 'Important risk disclosures and investment disclaimers for investors.', keywords: 'disclosure disclaimer risk warning investment caution', category: 'Legal' },
    { title: 'Regulatory Information', href: '/legal/regulatory-information', description: 'SEBI registration, exchange memberships, and compliance details.', keywords: 'regulatory sebi registration membership compliance nse bse mcx cdsl', category: 'Legal' },
    { title: 'Advisory - KYC Compliance', href: '/legal/kyc-advisory', description: 'KYC compliance requirements, advisory notices, and guidelines.', keywords: 'kyc know your customer compliance aadhar pan verification identity proof address', category: 'Legal' },
    { title: 'Investor Charter', href: '/legal/investor-charter', description: 'Your rights, responsibilities, and grievance redressal mechanisms as an investor.', keywords: 'investor charter rights responsibility redressal grievance arbitration ombudsman', category: 'Legal' },
    { title: 'Notices & Reports', href: '/legal/notices-and-reports', description: 'Official notices, annual reports, and regulatory filings.', keywords: 'notice report annual filing circular quarterly half yearly', category: 'Legal' },

    // Blog
    { title: 'Blog', href: '/blog', description: 'Latest articles, market insights, and educational content from Sunidhi.', keywords: 'blog article news insight opinion market education learn beginner', category: 'Blog' },

    // Other
    { title: 'Open Account', href: '/open-account', description: 'Open a trading and demat account with Sunidhi Securities in minutes.', keywords: 'open account register sign up new demat trading create account join', category: 'Get Started' },
  ];

  // Relevance-scored search
  const scoredResults = query
    ? searchablePages
        .map((page) => {
          const q = query.toLowerCase();
          const words = q.split(/\s+/).filter(w => w.length > 1);
          let score = 0;

          // Exact title match = highest priority
          if (page.title.toLowerCase() === q) score += 100;
          // Title contains query
          if (page.title.toLowerCase().includes(q)) score += 50;
          // Description contains query
          if (page.description.toLowerCase().includes(q)) score += 30;
          // Keywords contain query
          if (page.keywords.toLowerCase().includes(q)) score += 20;
          // Category match
          if (page.category.toLowerCase().includes(q)) score += 15;

          // Individual word matching
          for (const word of words) {
            if (page.title.toLowerCase().includes(word)) score += 10;
            if (page.description.toLowerCase().includes(word)) score += 5;
            if (page.keywords.toLowerCase().includes(word)) score += 8;
            if (page.category.toLowerCase().includes(word)) score += 3;
          }

          return { ...page, score };
        })
        .filter((page) => page.score > 0)
        .sort((a, b) => b.score - a.score)
    : [];

  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-8 w-8" />
            <h1 className="text-4xl md:text-5xl font-bold">Search Results</h1>
          </div>
          <p className="text-xl text-primary-100">
            {query ? `Showing results for "${query}"` : 'Enter a search query to find what you need'}
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {!query ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Please enter a search term</p>
            </div>
          ) : scoredResults.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No results found for "{query}"</p>
              <p className="text-gray-500">Try different keywords or browse our menu</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Found {scoredResults.length} result{scoredResults.length !== 1 ? 's' : ''}
              </p>
              <div className="grid gap-6">
                {scoredResults.map((result, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded">
                              {result.category}
                            </span>
                          </div>
                          <CardTitle className="text-xl mb-2">
                            <Link
                              href={result.href}
                              className="hover:text-primary-600 flex items-center gap-2"
                            >
                              {result.title}
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </CardTitle>
                          <CardDescription className="text-base">
                            {result.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Link
                        href={result.href}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        View Page →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="py-16">
        <Container>
          <p className="text-center text-gray-500">Loading search results...</p>
        </Container>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
