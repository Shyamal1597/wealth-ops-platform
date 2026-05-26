import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Shield, Zap, CheckCircle2, Clock, Smartphone } from "lucide-react";
import Image from "next/image";

export default function RetailEquityPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Retail Equity</h1>
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
    </>
  );
}
