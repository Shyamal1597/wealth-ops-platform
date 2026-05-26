import Link from "next/link";
import { TrendingUp, LineChart, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export default function EquityTradingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-8 w-8" />
              <span className="text-sm font-semibold uppercase tracking-wide">Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Equity Trading
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Trade stocks across NSE and BSE with advanced platforms, real-time market data, and expert research support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/open-account">
                  Start Trading
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100" asChild>
                <Link href="/support/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Trade With Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the advantage of trading with industry leaders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary-600" />}
              title="Lightning Fast"
              description="Execute trades in milliseconds with our high-performance trading platform"
            />
            <FeatureCard
              icon={<LineChart className="h-10 w-10 text-primary-600" />}
              title="Advanced Charts"
              description="Technical analysis tools with 100+ indicators and drawing tools"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary-600" />}
              title="Secure Trading"
              description="Bank-grade security with two-factor authentication"
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-primary-600" />}
              title="Expert Research"
              description="Access to detailed research reports and market insights"
            />
          </div>
        </Container>
      </section>

      {/* What You Get */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You Get
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Trading Platforms</CardTitle>
                <CardDescription>Multiple platforms for every trading style</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Web-based trading platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Mobile apps for iOS and Android</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Desktop trading terminal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>API for algorithmic trading</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Access</CardTitle>
                <CardDescription>Trade across multiple exchanges</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>NSE - National Stock Exchange</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>BSE - Bombay Stock Exchange</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Real-time market data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>After-market orders (AMO)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Research & Analysis</CardTitle>
                <CardDescription>Make informed decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Daily market reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Stock recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Technical and fundamental analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Expert webinars and training</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support & Services</CardTitle>
                <CardDescription>We're here to help</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Dedicated relationship manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Branch assistance across 100+ locations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>Online chat and phone support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="bg-primary-600 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Open your trading account today and get access to premium features and research
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/open-account">
                Open Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
