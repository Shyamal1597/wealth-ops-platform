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

  // Define searchable content
  const searchablePages = [
    // Expertise
    { title: 'Retail Equity', href: '/expertise/retail-equity', description: 'Pioneers of online market trading in India - equity, commodity, internet, and currency trading', category: 'Expertise' },
    { title: 'Institution Equity (Corporate)', href: '/expertise/institution-equity', description: 'Stringent research methodology for institutional investors, MFs, insurance companies, and banks', category: 'Expertise' },
    { title: 'Commodities Trading', href: '/expertise/commodities-trading', description: 'Robust dealing desk for commodity market with gold delivery expertise', category: 'Expertise' },
    { title: 'Foreign Exchange', href: '/expertise/foreign-exchange', description: 'Interbank Forex trade for RBI-licensed dealers, FEDAI certified', category: 'Expertise' },
    { title: 'Wholesale Debt Market', href: '/expertise/wholesale-debt-market', description: 'WDM trading, economic research, and money market instruments', category: 'Expertise' },
    { title: 'Retail Debt Market', href: '/expertise/retail-debt-market', description: 'Tailor-made products for long-term investors seeking steady income', category: 'Expertise' },
    { title: 'Mutual Fund Distribution', href: '/expertise/mutual-fund-distribution', description: 'Professional mutual fund distribution with expert fund selection', category: 'Expertise' },
    { title: 'Depository Services', href: '/expertise/depository-services', description: 'CDSL SEBI registered depository participant for secure digital holdings', category: 'Expertise' },
    { title: 'Research', href: '/expertise/research', description: 'In-depth equity research with focus on mid-caps and absolute returns', category: 'Expertise' },
    { title: 'Sunidhi Capital (NBFC)', href: '/expertise/sunidhi-capital', description: 'Capital solutions for every lending need', category: 'Expertise' },

    // About
    { title: 'Our Story', href: '/about/story', description: '58 Years of Excellence in Financial Services', category: 'About' },
    { title: 'Leadership', href: '/about/leadership', description: 'Meet our experienced leadership team', category: 'About' },
    { title: 'Life at Sunidhi', href: '/about/life-at-sunidhi', description: 'Join our team and grow your career', category: 'About' },
    { title: 'Awards & Recognition', href: '/about/awards', description: 'Our achievements and industry recognition', category: 'About' },
    { title: 'CSR', href: '/about/csr', description: 'Corporate Social Responsibility initiatives', category: 'About' },
    { title: 'Sunidhi Foundation', href: '/about/foundation', description: 'Our charitable foundation and community work', category: 'About' },
    { title: 'Careers', href: '/about/careers', description: 'Explore career opportunities at Sunidhi', category: 'About' },

    // Markets
    { title: 'Research Reports', href: '/markets/research', description: 'Expert research reports and analysis', category: 'Markets' },
    { title: 'Daily Updates', href: '/markets/updates', description: 'Daily market news and updates', category: 'Markets' },
    { title: 'Educational Resources', href: '/markets/education', description: 'Learn about trading and investments', category: 'Markets' },

    // Tools
    { title: 'Brokerage Calculator', href: '/tools/brokerage-calculator', description: 'Calculate brokerage charges', category: 'Tools' },
    { title: 'Margin Calculator', href: '/tools/margin-calculator', description: 'Calculate margin requirements', category: 'Tools' },
    { title: 'SIP Calculator', href: '/tools/sip-calculator', description: 'Plan your systematic investments', category: 'Tools' },
    { title: 'Tax Calculator', href: '/tools/tax-calculator', description: 'Calculate tax on your investments', category: 'Tools' },

    // Support
    { title: 'Help Center', href: '/support/help', description: 'Get help and support', category: 'Support' },
    { title: 'Contact Us', href: '/support/contact', description: 'Get in touch with us', category: 'Support' },
    { title: 'Downloads & Forms', href: '/support/downloads', description: 'Download forms and documents', category: 'Support' },
    { title: 'Branch Locations', href: '/support/branches', description: 'Find our branches near you', category: 'Support' },

    // Legal
    { title: 'Privacy Policy', href: '/legal/privacy-policy', description: 'Our privacy policy and data protection commitment', category: 'Legal' },
    { title: 'Disclosure & Disclaimer', href: '/legal/disclosure-disclaimer', description: 'Important disclosures and risk disclaimers for investors', category: 'Legal' },
    { title: 'Regulatory Information', href: '/legal/regulatory-information', description: 'Compliance requirements and regulatory guidelines', category: 'Legal' },
    { title: 'Advisory - KYC Compliance', href: '/legal/kyc-advisory', description: 'KYC compliance requirements and advisory', category: 'Legal' },
    { title: 'Investor Charter', href: '/legal/investor-charter', description: 'Your rights, responsibilities, and redressal mechanisms', category: 'Legal' },

    // Other
    { title: 'Open Account', href: '/open-account', description: 'Open a trading account with Sunidhi', category: 'Get Started' },
    { title: 'Login', href: '/login', description: 'Login to your account', category: 'Account' },
  ];

  // Filter results based on query
  const results = query
    ? searchablePages.filter((page) => {
        const searchLower = query.toLowerCase();
        return (
          page.title.toLowerCase().includes(searchLower) ||
          page.description.toLowerCase().includes(searchLower) ||
          page.category.toLowerCase().includes(searchLower)
        );
      })
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
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No results found for "{query}"</p>
              <p className="text-gray-400">Try different keywords or browse our menu</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              <div className="grid gap-6">
                {results.map((result, index) => (
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
