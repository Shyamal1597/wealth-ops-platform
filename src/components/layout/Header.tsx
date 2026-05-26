"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Search, LogOut, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useRouter } from "next/navigation";
import { CLIENT_LOGINS } from "@/lib/constants";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Calculate years since inception (founded in 1957)
  const FOUNDING_YEAR = 1957;
  const currentYear = new Date().getFullYear();
  const yearsOfExcellence = currentYear - FOUNDING_YEAR;

  const navigation = {
    expertise: [
      { name: "Retail Equity", href: "/expertise/retail-equity" },
      { name: "Institution Equity (Corporate)", href: "/expertise/institution-equity" },
      { name: "Margin Trading Facility (MTF)", href: "/expertise/mtf" },
      { name: "Commodities Trading", href: "/expertise/commodities-trading" },
      { name: "Foreign Exchange", href: "/expertise/foreign-exchange" },
      { name: "Wholesale Debt Market", href: "/expertise/wholesale-debt-market" },
      { name: "Mutual Funds", href: "/services/mutual-funds" },
      { name: "Mutual Fund Distribution", href: "/expertise/mutual-fund-distribution" },
      { name: "Depository Services", href: "/expertise/depository-services" },
      { name: "Research", href: "/expertise/research" },
      { name: "Sunidhi Capital (NBFC)", href: "/expertise/sunidhi-capital" },
    ],
    markets: [
      { name: "Research Reports", href: "/markets/research" },
      { name: "SIP Products", href: "/markets/sip-products" },
      { name: "Daily Updates", href: "/markets/daily-updates" },
      { name: "IPO Center", href: "https://ipo.meon.co.in/sunidhi", external: true },
      { name: "NSE RSS Feeds", href: "/markets/nse-rss" },
    ],
    resources: [
      { name: "Trading Holidays", href: "/resources/holidays" },
      { name: "Settlement Calendar", href: "/resources/settlement-calendar" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/legal/privacy-policy" },
      { name: "Disclosure & Disclaimer", href: "/legal/disclosure-disclaimer" },
      { name: "Regulatory Information", href: "/legal/regulatory-information" },
      { name: "Advisory - KYC Compliance", href: "/legal/kyc-advisory" },
      { name: "Investor Charter", href: "/legal/investor-charter" },
      { name: "Notices & Reports", href: "/legal/notices-and-reports" },
    ],
    tools: [
      { name: "Brokerage Calculator", href: "/tools/brokerage-calculator" },
      { name: "Tax Calculator", href: "/tools/tax-calculator" },
    ],
    about: [
      { name: "Our Story", href: "/about/story" },
      { name: "Leadership", href: "/about/leadership" },
      { name: "Life at Sunidhi", href: "/about/life-at-sunidhi" },
      { name: "Awards & Recognition", href: "/about/awards" },
      { name: "CSR & Foundation", href: "/about/csr" },
      { name: "Careers", href: "/about/careers" },
    ],
    support: [
      { name: "Help Center", href: "/support/help" },
      { name: "Contact Us", href: "/support/contact" },
      { name: "Downloads & Forms", href: "/support/downloads" },
      { name: "Become a Sub Broker/AP", href: "/support/sub-brokers" },
      { name: "Feedback", href: "/feedback" },
    ],
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-primary-600 text-white text-sm">
        <Container>
          <div className="flex justify-between items-center py-2">
            <div className="flex gap-6">
              <span>{yearsOfExcellence}+ Years of Excellence</span>
              <span>|</span>
              <span>100+ Locations</span>
              <span>|</span>
              <span>50,000+ Happy Clients</span>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white rounded border-none"
                aria-label={searchOpen ? "Close search bar" : "Open search bar"}
                aria-expanded={searchOpen}
                aria-controls="global-search-bar"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Search
              </button>
              <Link href="/support/contact" className="hover:underline">
                Support
              </Link>
              <Link href="/support/help" className="hover:underline">
                Help
              </Link>
              <a
                href="https://www.sunidhi.com/default.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-white/60 bg-white/10 text-white text-xs font-semibold hover:bg-white hover:text-primary-700 transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                aria-label="Visit old Sunidhi website (opens in a new tab)"
              >
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                Old Website
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Header */}
      <Container>
        <nav className="flex items-center justify-between py-6 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/Sunidhi_logo_homepage.png"
              alt="Sunidhi Securities & Finance Limited"
              width={240}
              height={80}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            <NavDropdown title="About" items={navigation.about} />
            <NavDropdown title="Expertise" items={navigation.expertise} />
            <NavDropdown title="Markets & Research" items={navigation.markets} />
            <NavDropdown title="Resources" items={navigation.resources} />
            <NavDropdown title="Legal" items={navigation.legal} />
            <Link href="/blog" className="text-gray-700 hover:text-primary-600 font-medium">
              Blog
            </Link>
            <NavDropdown title="Tools" items={navigation.tools} />
            <NavDropdown title="Support" items={navigation.support} />
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <ClientLoginDropdown />
            <SettingsDropdown />
            <Button size="sm" asChild>
              <Link href="/open-account">Open Account</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -mr-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </nav>
      </Container>

      {/* Search Bar */}
      {searchOpen && (
        <div id="global-search-bar" className="border-t border-gray-200 bg-white" role="search">
          <Container>
            <div className="py-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
                className="relative max-w-2xl mx-auto"
              >
                <input
                  type="text"
                  placeholder="Search the website..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-700 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-primary-500 rounded p-1"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>
            </div>
          </Container>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-menu" className="lg:hidden border-t border-gray-200" aria-label="Mobile navigation">
          <Container>
            <div className="py-4 space-y-4">
              <MobileNavSection title="About" items={navigation.about} onItemClick={closeMobileMenu} />
              <MobileNavSection title="Expertise" items={navigation.expertise} onItemClick={closeMobileMenu} />
              <MobileNavSection title="Markets & Research" items={navigation.markets} onItemClick={closeMobileMenu} />
              <MobileNavSection title="Resources" items={navigation.resources} onItemClick={closeMobileMenu} />
              <MobileNavSection title="Legal" items={navigation.legal} onItemClick={closeMobileMenu} />
              <Link href="/blog" className="block py-2 font-medium text-gray-900" onClick={closeMobileMenu}>
                Blog
              </Link>
              <MobileNavSection title="Tools" items={navigation.tools} onItemClick={closeMobileMenu} />
              <MobileNavSection title="Support" items={navigation.support} onItemClick={closeMobileMenu} />

              <div className="flex flex-col gap-3 pt-4 border-t">
                <MobileClientLoginSection onItemClick={closeMobileMenu} />
                <MobileSettingsSection onItemClick={closeMobileMenu} />
                <Button asChild onClick={closeMobileMenu}>
                  <Link href="/open-account">Open Account</Link>
                </Button>
                <a
                  href="https://www.sunidhi.com/default.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Visit Old Website
                </a>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

function NavDropdown({ title, items }: { title: string; items: { name: string; href: string; external?: boolean }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || (e.altKey && e.key === 'ArrowDown')) {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
    >
      <button
        className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium focus:outline-none focus:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 flex flex-col"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="menu"
          aria-label={title}
        >
          {items.map((item) => (
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 focus-visible:bg-gray-100 focus-visible:text-primary-600 focus-visible:outline-none"
                role="menuitem"
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 focus-visible:bg-gray-100 focus-visible:text-primary-600 focus-visible:outline-none"
                role="menuitem"
              >
                {item.name}
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavSection({ title, items, onItemClick }: { title: string; items: { name: string; href: string; external?: boolean }[]; onItemClick: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-2 ml-4 space-y-1" role="menu" aria-label={title}>
          {items.map((item) => (
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-600 hover:text-primary-600 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-primary-500 rounded px-2 py-1"
                onClick={onItemClick}
                role="menuitem"
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-gray-600 hover:text-primary-600 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-primary-500 rounded px-2 py-1"
                onClick={onItemClick}
                role="menuitem"
              >
                {item.name}
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function ClientLoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || (e.altKey && e.key === 'ArrowDown')) {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
    >
      <Button
        variant="outline"
        size="sm"
        className="no-link-style flex items-center gap-1 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-primary-500"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        Client Login
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </Button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 flex flex-col"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="menu"
          aria-label="Client Login Dropdown"
        >
          <a
            href={CLIENT_LOGINS.onlineTrading.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-link-style block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 focus-visible:bg-gray-100 focus-visible:text-primary-600 focus-visible:outline-none"
            role="menuitem"
          >
            {CLIENT_LOGINS.onlineTrading.name}
          </a>
          <a
            href={CLIENT_LOGINS.backoffice.client.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-link-style block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 focus-visible:bg-gray-100 focus-visible:text-primary-600 focus-visible:outline-none"
            role="menuitem"
          >
            {CLIENT_LOGINS.backoffice.client.name}
          </a>
          <a
            href={CLIENT_LOGINS.backoffice.branch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-link-style block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 focus-visible:bg-gray-100 focus-visible:text-primary-600 focus-visible:outline-none"
            role="menuitem"
          >
            {CLIENT_LOGINS.backoffice.branch.name}
          </a>
          <a
            href={CLIENT_LOGINS.kycOnline.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-link-style block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 focus-visible:bg-gray-100 focus-visible:text-primary-600 focus-visible:outline-none"
            role="menuitem"
          >
            {CLIENT_LOGINS.kycOnline.name}
          </a>
          <a
            href={CLIENT_LOGINS.mutualFunds.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-link-style block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 focus-visible:bg-gray-100 focus-visible:text-primary-600 focus-visible:outline-none"
            role="menuitem"
          >
            {CLIENT_LOGINS.mutualFunds.name}
          </a>
          <div className="my-1 border-t border-gray-100" role="separator" />
          <Link
            href="/research-login?redirect=/markets/sip-products"
            className="no-link-style block px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 focus-visible:bg-primary-50 focus-visible:outline-none"
            role="menuitem"
          >
            Direct Equity SIP
          </Link>
        </div>
      )}
    </div>
  );
}

function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const router = useRouter();
  let timeoutId: NodeJS.Timeout;

  useEffect(() => {
    const checkSession = () => {
      try {
        const data = sessionStorage.getItem('clientData');
        if (data) {
          const parsed = JSON.parse(data);
          setClientName(parsed.name || parsed.clientId || 'Client');
        } else {
          setClientName(null);
        }
      } catch { setClientName(null); }
    };
    checkSession();
    window.addEventListener('storage', checkSession);
    // Also listen for custom event so logout in same tab updates header
    window.addEventListener('clientSessionChange', checkSession);
    return () => {
      window.removeEventListener('storage', checkSession);
      window.removeEventListener('clientSessionChange', checkSession);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('clientData');
    setClientName(null);
    setIsOpen(false);
    window.dispatchEvent(new Event('clientSessionChange'));
    // Clear HttpOnly client-token cookie server-side
    fetch('/api/auth/client-logout', { method: 'POST' }).catch(() => {});
    router.push('/');
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || (e.altKey && e.key === 'ArrowDown')) {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  if (!clientName) return null;

  return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onBlur={handleBlur}
      >
        <Button
          variant="outline"
          size="sm"
          className="no-link-style flex items-center gap-1.5 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-primary-500"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <User className="h-4 w-4" aria-hidden="true" />
          <span className="max-w-[120px] truncate">{clientName.split(' ')[0]}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </Button>

        {isOpen && (
          <div
            className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 flex flex-col"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="menu"
            aria-label="User menu"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 truncate">{clientName}</p>
            </div>
            <Link
              href="/client/profile"
              className="no-link-style block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 focus-visible:bg-gray-100 focus-visible:text-primary-600 focus-visible:outline-none"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center gap-2"><User className="h-4 w-4" /> My Profile</span>
            </Link>
            <Link
              href="/markets/research"
              className="no-link-style block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 focus-visible:bg-gray-100 focus-visible:text-primary-600 focus-visible:outline-none"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center gap-2">Research Reports</span>
            </Link>
            <Link
              href="/markets/sip-products"
              className="no-link-style block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 focus-visible:bg-gray-100 focus-visible:text-primary-600 focus-visible:outline-none"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center gap-2">SIP Products</span>
            </Link>
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none flex items-center gap-2"
                role="menuitem"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

function MobileClientLoginSection({ onItemClick }: { onItemClick: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full px-4 py-2 text-left font-medium text-gray-900 border border-gray-300 rounded-md focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-primary-500"
      >
        Client Login
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="mt-2 ml-4 space-y-1" role="menu" aria-label="Client Login Dropdown">
          <a
            href={CLIENT_LOGINS.onlineTrading.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-gray-600 hover:text-primary-600 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-primary-500 rounded px-2 py-1"
            onClick={onItemClick}
            role="menuitem"
          >
            {CLIENT_LOGINS.onlineTrading.name}
          </a>
          <a
            href={CLIENT_LOGINS.backoffice.client.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-gray-600 hover:text-primary-600"
            onClick={onItemClick}
          >
            {CLIENT_LOGINS.backoffice.client.name}
          </a>
          <a
            href={CLIENT_LOGINS.backoffice.branch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-gray-600 hover:text-primary-600"
            onClick={onItemClick}
          >
            {CLIENT_LOGINS.backoffice.branch.name}
          </a>
          <a
            href={CLIENT_LOGINS.kycOnline.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-gray-600 hover:text-primary-600"
            onClick={onItemClick}
          >
            {CLIENT_LOGINS.kycOnline.name}
          </a>
          <a
            href={CLIENT_LOGINS.mutualFunds.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-gray-600 hover:text-primary-600"
            onClick={onItemClick}
          >
            {CLIENT_LOGINS.mutualFunds.name}
          </a>
          <div className="my-1 border-t border-gray-100" />
          <Link
            href="/research-login?redirect=/markets/sip-products"
            className="block text-sm font-medium text-primary-600 hover:text-primary-700 px-2 py-1"
            onClick={onItemClick}
          >
            Direct Equity SIP
          </Link>
        </div>
      )}
    </div>
  );
}

function MobileSettingsSection({ onItemClick }: { onItemClick: () => void }) {
  const [clientName, setClientName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = () => {
      try {
        const data = sessionStorage.getItem('clientData');
        if (data) {
          const parsed = JSON.parse(data);
          setClientName(parsed.name || parsed.clientId || 'Client');
        } else {
          setClientName(null);
        }
      } catch { setClientName(null); }
    };
    checkSession();
    window.addEventListener('clientSessionChange', checkSession);
    return () => window.removeEventListener('clientSessionChange', checkSession);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('clientData');
    setClientName(null);
    window.dispatchEvent(new Event('clientSessionChange'));
    // Clear HttpOnly client-token cookie server-side
    fetch('/api/auth/client-logout', { method: 'POST' }).catch(() => {});
    onItemClick();
    router.push('/');
  };

  if (!clientName) return null;

  return (
      <div className="space-y-2">
        <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-600">Signed in as</p>
          <p className="text-sm font-medium text-green-800 truncate">{clientName}</p>
        </div>
        <Link
          href="/client/profile"
          className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium"
          onClick={onItemClick}
        >
          My Profile
        </Link>
        <Link
          href="/markets/research"
          className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium"
          onClick={onItemClick}
        >
          Research Reports
        </Link>
        <Link
          href="/markets/sip-products"
          className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 font-medium"
          onClick={onItemClick}
        >
          SIP Products
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2 rounded-md"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    );
}
