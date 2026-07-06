import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Zap, CheckCircle2, Clock, LineChart, ArrowRight } from "lucide-react";

export default function RetailEquityPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Retail Equity & Equity Trading</h1>
          <p className="text-xl text-primary-100">
            As pioneers of online market trading in India, find out how we impact equity, commodity, internet, and currency trading.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Retail Equity at Sunidhi comprises equity, commodity, internet, and currency trading. We pioneered online market trading in India. A few other factors that have contributed to our success in this offering include:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Consistent and Contemporary Market Guidance</h3>
                        <p className="text-sm text-gray-600">Expert guidance aligned with current market trends</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Transparency in Research</h3>
                        <p className="text-sm text-gray-600">Clear fundamental and technical research analysis</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">High Compliance</h3>
                        <p className="text-sm text-gray-600">Fully compliant with all regulatory requirements</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Regular Updates</h3>
                        <p className="text-sm text-gray-600">Continuous research reports and recommendations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Zap className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">State-of-the-Art IT Systems</h3>
                        <p className="text-sm text-gray-600">Zero downtime with advanced technology</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                Sunidhi's Retail Equity offering has won the hearts of our customers, who continue to strengthen their relations with us. We have continued to meet expectations while, on occasions, even exceeding them. Our inspirational Service Assurance Team is proficient in delivering the best solutions to suit our clients. We regularly keep them updated with every evolving aspect of the markets.
              </p>

              <p className="text-gray-700 leading-relaxed mb-8">
                Sunidhi's experienced Risk Management Team also keeps our partners, agents and clients engaged through personal/branch visits, training programmes, calls, and seminars. Agents and clients are promptly updated with market alerts to quickly and effectively curtail trading losses. Those we serve are truly our priority.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Clock className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Real-time</h3>
                <p className="text-gray-600">Market Alerts</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Zap className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Zero</h3>
                <p className="text-gray-600">Down time</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Latency</h3>
                <p className="text-gray-600">In Transactions</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                We offer both EXE and mobile app-based trading options. We have expertise in online back office software (for branches and individual clients). We also offer a bouquet of options for sale and buy back. Our services extend to NBFCs.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Every day, our systems are up and running well before the markets. With state-of-the-art IT backing, Sunidhi can proudly boast no disruptions in transactions because of shortages in margin while serving clients. This empowers users to never miss an opportunity as well as iron out issues early in the day without losing any precious time. A detailed report of each day's dealings is sent out to ensure the highest level of transparency.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Internet Trading allows our clients to view their holdings online and choose to sell without any external help. Sunidhi believes in proactive serving enabled by technology. Our clients thus have all the information they need on their fingertips.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Equity Trading platforms, market access & support */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best Trading App in India for Stock Market Trading
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Open trading account and experience the best trading app in India for stock market and trading, intraday trading in capital market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary-600" />}
              title="Lightning Fast Intraday Trading"
              description="Execute stock market trading and intraday trading in milliseconds with our high-performance best trading app in India"
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

      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <div className="bg-primary-600 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Stock Market Trading?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Open trading account today for stock market trading and intraday trading with best trading app in India and get access to premium features and research in capital market
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
