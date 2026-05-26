"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Shield,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Building2,
  PieChart,
  Target,
  Award,
  X,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface AMC {
  AMC: string;
  Schemes: string[];
  Count: number;
}

export default function MutualFundsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [amcList, setAmcList] = useState<AMC[]>([]);
  const [selectedAMC, setSelectedAMC] = useState<AMC | null>(null);
  const [schemeSearchQuery, setSchemeSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Load AMC data from JSON file
  useEffect(() => {
    const loadSchemeData = async () => {
      try {
        const response = await fetch("/data/schemes.json");
        const data: AMC[] = await response.json();
        setAmcList(data.filter(amc => amc.AMC !== "Unknown AMC"));
        setLoading(false);
      } catch (error) {
        console.error("Error loading scheme data:", error);
        setLoading(false);
      }
    };
    loadSchemeData();
  }, []);

  // Helper function to determine scheme category (defined before use)
  const getSchemeCategory = (schemeName: string): string[] => {
    const name = schemeName.toLowerCase();
    const categories: string[] = [];

    // Check for ELSS
    if (name.includes('elss') || name.includes('tax saver') || name.includes('tax saving')) {
      categories.push('elss');
    }

    // Check for Index
    if (name.includes('index') || name.includes('nifty') || name.includes('sensex') || name.includes('etf')) {
      categories.push('index');
    }

    // Check for Debt
    if (name.includes('debt') || name.includes('bond') || name.includes('gilt') ||
        name.includes('liquid') || name.includes('income') || name.includes('duration') ||
        name.includes('treasury') || name.includes('money market') || name.includes('overnight')) {
      categories.push('debt');
    }

    // Check for Hybrid
    if (name.includes('hybrid') || name.includes('balanced') || name.includes('aggressive') ||
        name.includes('conservative') || name.includes('dynamic') || name.includes('equity & debt')) {
      categories.push('hybrid');
    }

    // Check for Equity (if not already categorized or if explicitly equity)
    if (categories.length === 0 || name.includes('equity') || name.includes('growth') ||
        name.includes('value') || name.includes('dividend') || name.includes('cap') ||
        name.includes('sector') || name.includes('thematic') || name.includes('pharma') ||
        name.includes('technology') || name.includes('banking') || name.includes('infra')) {
      categories.push('equity');
    }

    return categories;
  };

  // Calculate total schemes
  const totalSchemes = amcList.reduce((sum, amc) => sum + amc.Count, 0);

  // Calculate actual category counts
  const getCategoryCount = (categoryId: string): number => {
    if (categoryId === "all") return totalSchemes;

    let count = 0;
    amcList.forEach(amc => {
      // Add safety check to ensure Schemes is an array
      if (Array.isArray(amc.Schemes)) {
        amc.Schemes.forEach(scheme => {
          const categories = getSchemeCategory(scheme);
          if (categories.includes(categoryId)) {
            count++;
          }
        });
      }
    });
    return count;
  };

  const categories = [
    { id: "all", name: "All Funds", count: getCategoryCount("all") },
    { id: "equity", name: "Equity Funds", count: getCategoryCount("equity") },
    { id: "debt", name: "Debt Funds", count: getCategoryCount("debt") },
    { id: "hybrid", name: "Hybrid Funds", count: getCategoryCount("hybrid") },
    { id: "elss", name: "ELSS (Tax Saving)", count: getCategoryCount("elss") },
    { id: "index", name: "Index Funds", count: getCategoryCount("index") },
  ];

  const features = [
    {
      icon: PieChart,
      title: "Wide Fund Selection",
      description: `Choose from ${totalSchemes.toLocaleString()} mutual fund schemes across ${amcList.length}+ leading Asset Management Companies`,
    },
    {
      icon: Target,
      title: "Expert Guidance",
      description: "Get personalized investment advice from our certified mutual fund advisors",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "SEBI-registered platform ensuring safe and transparent transactions",
    },
    {
      icon: Award,
      title: "Zero Commission",
      description: "Direct plan investments with no hidden charges or commissions",
    },
  ];

  const benefits = [
    `Access to ${totalSchemes.toLocaleString()}+ mutual fund schemes`,
    "SIP starting from ₹500 per month",
    "Lumpsum investment options available",
    "Online KYC verification",
    "Real-time NAV updates",
    "Dedicated relationship manager",
    "Portfolio tracking and reporting",
    "Tax-saving ELSS funds",
    "Switch and redemption facilities",
    "Systematic withdrawal plans (SWP)",
  ];

  const faqs = [
    {
      question: "How many mutual funds does Sunidhi Securities offer?",
      answer: `Sunidhi Securities provides access to all ${totalSchemes.toLocaleString()} mutual fund schemes from ${amcList.length}+ leading Asset Management Companies (AMCs) registered with SEBI. This includes equity, debt, hybrid, ELSS, index funds, and more across various categories and risk profiles.`,
    },
    {
      question: "What is the minimum investment amount for mutual funds?",
      answer: "You can start investing in mutual funds through SIP (Systematic Investment Plan) with as low as ₹500 per month. For lumpsum investments, the minimum amount varies by fund, typically starting from ₹5,000. Some funds may have different minimum investment requirements.",
    },
    {
      question: "What are the charges for investing in mutual funds through Sunidhi?",
      answer: "We offer Direct Plan mutual funds with zero commission. You only pay the fund's expense ratio as charged by the AMC. There are no additional distribution fees, commission charges, or hidden costs. Direct plans have lower expense ratios compared to regular plans.",
    },
    {
      question: "How do I start investing in mutual funds?",
      answer: "To start investing: 1) Open a Demat account with Sunidhi Securities, 2) Complete your KYC verification online, 3) Browse our mutual fund listings by AMC or category, 4) Select the fund you want to invest in, 5) Choose SIP or lumpsum investment, 6) Make payment through net banking, UPI, or other available methods. Your units will be allocated at the applicable NAV.",
    },
    {
      question: "What is the difference between SIP and lumpsum investment?",
      answer: "SIP (Systematic Investment Plan) involves investing a fixed amount regularly (monthly, quarterly, etc.), which helps in rupee cost averaging and disciplined investing. Lumpsum is a one-time investment of a large amount. SIP is suitable for regular income earners, while lumpsum works well when you have surplus funds. Both have their advantages based on market conditions and your financial goals.",
    },
    {
      question: "Are mutual funds safe investments?",
      answer: "Mutual funds are regulated by SEBI and managed by professional fund managers. However, like all market-linked investments, they carry market risks. Returns are not guaranteed. The risk level varies by fund type—equity funds are higher risk-higher return, while debt funds are relatively lower risk. We recommend diversifying your portfolio and investing according to your risk appetite and financial goals.",
    },
    {
      question: "How can I track my mutual fund investments?",
      answer: "You can track your mutual fund portfolio through: 1) Your Sunidhi Securities trading account, 2) Monthly account statements sent via email, 3) CAMS/Karvy consolidated account statement, 4) Our customer portal showing real-time NAV, current value, gains/losses, and returns. You can also contact your relationship manager for detailed portfolio reviews.",
    },
    {
      question: "Can I switch between different mutual funds?",
      answer: "Yes, you can switch (exchange) your investment from one scheme to another within the same AMC. This is essentially a redemption from one fund and investment in another. Exit loads may apply as per the fund's terms. Switching between different AMCs requires redemption from one and fresh investment in another. Tax implications may apply based on the holding period.",
    },
    {
      question: "What is ELSS and how does it help in tax saving?",
      answer: "ELSS (Equity Linked Savings Scheme) is a tax-saving mutual fund with a 3-year lock-in period. Investments up to ₹1.5 lakh per year qualify for tax deduction under Section 80C of the Income Tax Act. ELSS funds invest primarily in equity markets, offering potential for higher returns compared to traditional tax-saving instruments like PPF or NSC.",
    },
    {
      question: "How long does it take to redeem mutual funds?",
      answer: "Redemption timelines vary by fund type: Liquid funds - 1 business day, Debt funds - 1-3 business days, Equity funds - 3-4 business days. The amount is credited to your registered bank account after the redemption is processed. Exit loads may apply if you redeem before the specified holding period.",
    },
  ];

  // Filter AMCs based on category and search
  const filteredAMCs = amcList
    .map((amc) => {
      // Ensure Schemes is an array
      if (!Array.isArray(amc.Schemes)) return { ...amc, matchingSchemes: 0, visible: false };

      // Count how many schemes match the search query
      const matchingSchemes = searchQuery === ""
        ? amc.Count
        : amc.Schemes.filter(scheme => scheme.toLowerCase().includes(searchQuery.toLowerCase())).length;

      // AMC name matches search?
      const amcNameMatches = searchQuery !== "" && amc.AMC.toLowerCase().includes(searchQuery.toLowerCase());

      // Must have matching schemes or AMC name match
      const matchesSearch = searchQuery === "" || matchingSchemes > 0 || amcNameMatches;

      if (!matchesSearch) return { ...amc, matchingSchemes: 0, visible: false };

      // If category filter is active, check if matching schemes belong to selected category
      if (selectedCategory !== "all") {
        const categoryMatchCount = amc.Schemes.filter(scheme => {
          const matchesQ = searchQuery === "" || scheme.toLowerCase().includes(searchQuery.toLowerCase());
          const categories = getSchemeCategory(scheme);
          return matchesQ && categories.includes(selectedCategory);
        }).length;

        if (categoryMatchCount === 0 && !amcNameMatches) return { ...amc, matchingSchemes: 0, visible: false };
        return { ...amc, matchingSchemes: categoryMatchCount, visible: true };
      }

      return { ...amc, matchingSchemes: amcNameMatches ? amc.Count : matchingSchemes, visible: true };
    })
    .filter(amc => amc.visible)
    .sort((a, b) => b.matchingSchemes - a.matchingSchemes); // Show most relevant AMCs first

  // Filter schemes when AMC is selected
  const filteredSchemes = selectedAMC && Array.isArray(selectedAMC.Schemes)
    ? selectedAMC.Schemes.filter(scheme => {
        const matchesSearch = schemeSearchQuery === "" ||
          scheme.toLowerCase().includes(schemeSearchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // If "all" category selected, show all matching schemes
        if (selectedCategory === "all") return true;

        // Check if scheme belongs to selected category
        const categories = getSchemeCategory(scheme);
        return categories.includes(selectedCategory);
      })
    : [];

  // When user clicks an AMC from search, pre-fill the scheme search
  const handleAMCClick = (amc: AMC) => {
    setSelectedAMC(amc);
    // If user was searching, carry the search query into the scheme modal
    if (searchQuery) {
      setSchemeSearchQuery(searchQuery);
    } else {
      setSchemeSearchQuery("");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              {loading ? "Loading..." : `${totalSchemes.toLocaleString()} Mutual Fund Schemes Available`}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Invest in Mutual Funds with{" "}
              <span className="text-white/90">Confidence</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {loading ? "Loading mutual fund data..." : `Access all leading mutual funds from ${amcList.length}+ AMCs with expert guidance and zero commission`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild className="bg-white text-primary-600 hover:bg-gray-100 border-0 text-lg px-8">
                <Link href="/open-account">Start Investing Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-lg px-8">
                <Link href="/support/contact">Speak to an Advisor</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Invest with Sunidhi Securities?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted partner for mutual fund investments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Benefits</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      {/* Fund Categories */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find the right mutual funds for your investment goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary-600 border-primary-600 text-white shadow-lg"
                    : "bg-white border-gray-200 text-gray-900 hover:border-primary-300 hover:shadow-md"
                }`}
              >
                <div className="text-2xl font-bold mb-1">{category.count}</div>
                <div className="text-sm font-medium">{category.name}</div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* AMC List Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                All Asset Management Companies (AMCs)
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {loading ? "Loading..." : `Browse mutual funds from ${amcList.length}+ leading AMCs in India`}
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search AMC or scheme name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none text-lg"
                  />
                </div>
                {searchQuery && (
                  <p className="text-sm text-gray-500 mt-2">
                    Found <strong>{filteredAMCs.length}</strong> AMC{filteredAMCs.length !== 1 ? 's' : ''} with matching schemes for &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading mutual fund data...</p>
              </div>
            ) : (
              <>
                {/* AMC Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAMCs.map((amc, index) => (
                    <Card
                      key={index}
                      className="bg-black border-2 border-primary-600 hover:shadow-xl hover:shadow-primary-600/50 transition-all cursor-pointer"
                      onClick={() => handleAMCClick(amc)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-white mb-2 text-base leading-tight">
                              {amc.AMC}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-300">
                                {searchQuery
                                  ? `${amc.matchingSchemes} matching scheme${amc.matchingSchemes !== 1 ? 's' : ''} (${amc.Count} total)`
                                  : `${amc.Count} schemes available`}
                              </span>
                            </div>
                            <div className="mt-3">
                              <Button size="sm" className="w-full bg-primary-600 hover:bg-primary-700 text-white border-0">
                                View Schemes
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredAMCs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No AMCs or schemes found matching your search.</p>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-6">
                    Total: <strong>{filteredAMCs.length} AMCs</strong> offering <strong>{totalSchemes.toLocaleString()} mutual fund schemes</strong>
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/open-account">Start Your Investment Journey</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </Container>
      </section>

      {/* Scheme Display Modal */}
      {selectedAMC && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAMC(null)}>
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-primary-600 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedAMC.AMC}</h2>
                <p className="text-white/90">{selectedAMC.Count} Mutual Fund Schemes</p>
              </div>
              <button
                onClick={() => setSelectedAMC(null)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Scheme Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search schemes..."
                    value={schemeSearchQuery}
                    onChange={(e) => setSchemeSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Schemes List */}
              <div className="overflow-y-auto max-h-[60vh]">
                <div className="grid md:grid-cols-2 gap-3">
                  {filteredSchemes.map((scheme, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-900 leading-relaxed">{scheme}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredSchemes.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No schemes found matching your search.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <p className="text-gray-600">
                  Showing <strong>{filteredSchemes.length}</strong> of <strong>{selectedAMC.Count}</strong> schemes
                </p>
                <Button asChild>
                  <Link href="/support/contact">Contact Us to Invest</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How to Invest Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How to Invest in Mutual Funds
              </h2>
              <p className="text-lg text-gray-600">
                Get started in 4 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: "Open Account",
                  description: "Complete your online KYC and open a Demat account",
                },
                {
                  step: 2,
                  title: "Choose Funds",
                  description: "Browse and select funds based on your goals",
                },
                {
                  step: 3,
                  title: "Start SIP/Lumpsum",
                  description: "Begin with SIP from ₹500 or lumpsum investment",
                },
                {
                  step: 4,
                  title: "Track & Grow",
                  description: "Monitor your portfolio and watch it grow",
                },
              ].map((item, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to know about mutual fund investing
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-8">{faq.question}</h3>
                      {openFAQ === index ? (
                        <ChevronUp className="h-5 w-5 text-primary-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {loading ? "Get started with mutual fund investing" : `Open your account today and get access to ${totalSchemes.toLocaleString()} mutual fund schemes`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild className="bg-white text-primary-600 hover:bg-gray-100 border-0">
                <Link href="/open-account">Open Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                <Link href="/support/contact">Talk to Expert</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-600 text-center">
              <strong>Disclaimer:</strong> Mutual Fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future returns. The information provided is for educational purposes only and should not be considered as investment advice.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
