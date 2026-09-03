"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Shield,
  Clock,
  Wallet,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowRight,
  Zap,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";

interface FAQ {
  question: string;
  answer: string;
}

export default function MTFPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const features = [
    {
      icon: TrendingUp,
      title: "Enhanced Buying Power",
      description: "Access up to 4x leverage on your equity positions and maximize your investment potential with our margin facility.",
    },
    {
      icon: Wallet,
      title: "Flexible Funding",
      description: "Pay only a fraction upfront and fund the balance amount at your convenience within the specified period.",
    },
    {
      icon: Clock,
      title: "Extended Holding Period",
      description: "Hold your positions for extended periods, giving you the flexibility to wait for the right exit opportunity.",
    },
    {
      icon: Shield,
      title: "Regulated & Secure",
      description: "Our MTF is fully compliant with SEBI regulations, ensuring your investments are protected and transparent.",
    },
    {
      icon: FileText,
      title: "Wide Stock Selection",
      description: "Choose from a comprehensive list of approved securities across various sectors and market capitalizations.",
    },
    {
      icon: Zap,
      title: "Instant Activation",
      description: "Start trading with MTF immediately—no separate account opening or lengthy documentation required.",
    },
  ];

  const benefits = [
    "Amplify returns with leveraged positions",
    "Lower upfront capital requirement",
    "Hold positions beyond T+0 settlement",
    "Competitive interest rates on margin funding",
    "No need for derivatives knowledge",
    "Professional risk management support",
  ];

  const activationSteps = [
    {
      step: 1,
      title: "Ensure KYC Compliance",
      description: "Make sure your account is fully KYC compliant with updated documents and verification.",
    },
    {
      step: 2,
      title: "Check Eligibility",
      description: "Review the approved MTF stock list and ensure you have sufficient margin in your account.",
    },
    {
      step: 3,
      title: "Place MTF Order",
      description: "Select MTF as the product type while placing your order through our trading platform.",
    },
    {
      step: 4,
      title: "Fund Margin Amount",
      description: "Pay the required margin percentage (typically 25-40%) to initiate the trade.",
    },
    {
      step: 5,
      title: "Monitor & Manage",
      description: "Track your MTF positions, interest charges, and margin requirements through your dashboard.",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "What is Margin Trading Facility (MTF)?",
      answer: "Margin Trading Facility (MTF) allows you to purchase securities by paying only a portion of the total trade value upfront. The remaining amount is funded by Sunidhi Securities, enabling you to take larger positions with limited capital. Interest is charged on the funded amount.",
    },
    {
      question: "What is the maximum leverage available under MTF?",
      answer: "The leverage available under MTF depends on the stock and market conditions. Typically, you can get up to 4x leverage on approved securities. The actual margin requirement varies from 25% to 40% depending on the stock's volatility and regulatory requirements.",
    },
    {
      question: "How long can I hold MTF positions?",
      answer: "You can hold MTF positions for extended periods, subject to maintaining the required margin levels and paying applicable interest charges. However, we recommend reviewing your positions regularly and squaring off when your target is achieved.",
    },
    {
      question: "What are the interest charges for MTF?",
      answer: "Interest charges are calculated on a daily basis on the funded amount. The interest rate is competitive and varies based on market conditions and the duration of holding. Please contact our relationship manager for current interest rates.",
    },
    {
      question: "Which stocks are available for MTF trading?",
      answer: "We offer MTF on a select list of approved securities that meet SEBI's eligibility criteria. The list includes large-cap and mid-cap stocks with good liquidity. You can view the complete MTF stock list on our trading platform or contact us for details.",
    },
    {
      question: "What happens if my position goes into a loss?",
      answer: "If your MTF position moves against you and your margin falls below the required level, you'll receive a margin call. You must either add funds to maintain the position or square off the position to prevent forced liquidation. We monitor positions closely to protect both parties.",
    },
    {
      question: "Can I convert my regular delivery position to MTF?",
      answer: "In most cases, positions must be initiated as MTF at the time of order placement. However, please check with our trading desk for any conversion facilities that may be available on specific stocks.",
    },
    {
      question: "Are there any additional charges for using MTF?",
      answer: "Apart from interest on the funded amount, standard brokerage and statutory charges apply as per your account tariff. There are no separate MTF activation fees. All charges are transparently displayed before order confirmation.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary-600/20 text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Amplify Your Trading Potential
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Trade More with{" "}
              <span className="text-primary-500">Margin Trading Facility</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Maximize your investment opportunities with up to 4x leverage on approved securities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/open-account">
                  Get Started with MTF
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link href="/support/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* What is MTF Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What is Margin Trading Facility?
              </h2>
              <p className="text-lg text-gray-600">
                A powerful tool to enhance your trading capabilities
              </p>
            </div>

            <Card className="border-2 border-primary-100">
              <CardContent className="p-8">
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Margin Trading Facility (MTF) is a financing option that allows you to purchase securities by
                    paying only a fraction of the total trade value upfront. Sunidhi Securities funds the remaining
                    amount, enabling you to take larger positions and potentially amplify your returns.
                  </p>

                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">How it Works</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-bold">1</span>
                        </div>
                        <p className="font-semibold text-gray-900 mb-2">You Pay</p>
                        <p className="text-3xl font-bold text-primary-600">25-40%</p>
                        <p className="text-sm text-gray-600 mt-1">Margin Amount</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-bold">2</span>
                        </div>
                        <p className="font-semibold text-gray-900 mb-2">We Fund</p>
                        <p className="text-3xl font-bold text-primary-600">60-75%</p>
                        <p className="text-sm text-gray-600 mt-1">Balance Amount</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-bold">3</span>
                        </div>
                        <p className="font-semibold text-gray-900 mb-2">You Get</p>
                        <p className="text-3xl font-bold text-primary-600">Up to 4x</p>
                        <p className="text-sm text-gray-600 mt-1">Buying Power</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed">
                    For example, with ₹25,000 as margin, you can potentially purchase securities worth up to ₹1,00,000,
                    giving you the opportunity to participate in larger trades and maximize your investment potential.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features & Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how MTF can transform your trading experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Sunidhi MTF?</h3>
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

      {/* Activation Process */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How to Activate MTF
              </h2>
              <p className="text-lg text-gray-600">
                Get started with Margin Trading in 5 simple steps
              </p>
            </div>

            <div className="space-y-6">
              {activationSteps.map((item, index) => (
                <Card key={index} className="border-l-4 border-primary-600">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <Link href="/open-account">
                  Open Your MTF Account Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to know about MTF
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

      {/* Risk Warning */}
      <section className="py-12 bg-yellow-50 border-t border-b border-yellow-200">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Important Disclaimer</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>Risk Warning:</strong> Margin Trading involves significant risk and may not be suitable for all investors.
                    Leveraged trading can amplify both gains and losses. You may lose more than your initial investment.
                  </p>
                  <p>
                    Investments in securities market are subject to market risks. Please read all scheme-related documents carefully
                    before investing. Past performance is not indicative of future returns.
                  </p>
                  <p>
                    Interest will be charged on the funded amount as per the prevailing rates. Failure to maintain adequate margin
                    may result in forced liquidation of your positions. Please ensure you understand the risks involved before
                    using MTF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Amplify Your Trading?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start trading with Margin Trading Facility today and unlock your investment potential
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild className="bg-white text-primary-600 hover:bg-gray-100 border-0">
                <Link href="/open-account">
                  <Users className="mr-2 h-5 w-5" />
                  Open Account
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                <Link href="/support/contact">
                  Contact Our Team
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
