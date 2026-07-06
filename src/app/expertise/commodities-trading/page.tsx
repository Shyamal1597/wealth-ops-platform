import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Award, TrendingUp, Building2, Banknote, ArrowRight } from "lucide-react";

export default function CommoditiesTradingPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Derivatives & Commodity Trading</h1>
          <p className="text-xl text-primary-100">
            Trade in commodity market with our advanced commodities trading platform. Access commodity trading with a robust dealing desk, comprising a strong and reliable team that exclusively caters to the commodity market with best trading app in India.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Sunidhi offers the best commodities trading platform in India with a robust dealing desk that comprises a strong and reliable team exclusively catering to the commodity market. Open trading account for commodity trading and access our commodity market expertise. We were the first recipients of a 'Gold Delivery on Exchange' on our client's behalf. Our commodity trading services include dealings in the capital market, enabled by physical presence in the commodity market.
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Industry First</h3>
                        <p className="text-sm text-gray-600">First recipients of Gold Delivery on Exchange</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Physical Presence</h3>
                        <p className="text-sm text-gray-600">On-ground presence in commodity markets</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Arbitrage Expertise</h3>
                        <p className="text-sm text-gray-600">Between spot and future markets for various commodities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Banknote className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Currency Market Support</h3>
                        <p className="text-sm text-gray-600">Supporting client demands in currency markets</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                Our commodities trading platform helps us carry out arbitrage between the spot and future markets for various Indian commodities in the commodity market. Our clients include HNIs and leading corporates who use our best trading app in India for commodity trading. We also support clients with forex trading in India and currency market demands.
              </p>

              <p className="text-gray-700 leading-relaxed mb-8">
                Our exclusive focus on commodity trading and the commodity market, combined with our physical market presence and advanced commodities trading platform, gives us a unique advantage in serving our clients with precision and expertise in capital market operations. Open trading account today for commodity market access.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">First</h3>
                <p className="text-gray-600">Gold Delivery on Exchange</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Coins className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Robust</h3>
                <p className="text-gray-600">Dealing Desk</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Building2 className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Physical</h3>
                <p className="text-gray-600">Market Presence</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Derivatives: Futures & Options */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Futures & Options Trading</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Index Futures & Options (Nifty, Bank Nifty, Fin Nifty)</li>
                  <li>✓ Stock Futures & Options</li>
                  <li>✓ Currency Derivatives</li>
                  <li>✓ Advanced option strategies</li>
                  <li>✓ Margin calculator and risk tools</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Low brokerage and competitive margins</li>
                  <li>✓ Real-time options chain analysis</li>
                  <li>✓ Option strategy builder</li>
                  <li>✓ Volatility analysis tools</li>
                  <li>✓ Dedicated derivatives research team</li>
                  <li>✓ Risk management support</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-primary-600 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Trading Derivatives & Commodities Today
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Leverage our advanced tools and expert support to maximize your trading potential
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
