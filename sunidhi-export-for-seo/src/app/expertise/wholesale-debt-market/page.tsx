import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, Shield, CheckCircle2, BarChart3, Award } from "lucide-react";

export default function WholesaleDebtMarketPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Wholesale Debt Market</h1>
          <p className="text-xl text-primary-100">
            As one of the oldest broking firms in India, we know our way around Wholesale Debt Market (WDM) trading, economic research as well as trade in every money market instrument.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Sunidhi is one of the oldest broking firms in India that offers Wholesale Debt Market (WDM) trading. We excel at broking services, economic research as well as in every money market instrument. We offer private placements of commercial papers, corporate debts, buying and selling of treasury bills, government securities, and state government loans. We are also sought to advice switch deals in government securities.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">The factors that make us a primary choice within WDM services are:</h3>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Authority on Custom Structure Deals</h3>
                        <p className="text-sm text-gray-600">Unique requirements handled with expertise</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Prediction of CPI and WPI Numbers</h3>
                        <p className="text-sm text-gray-600">Accurate economic forecasting</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <FileText className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Daily Research Across Various Maturities</h3>
                        <p className="text-sm text-gray-600">Comprehensive market analysis</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Liquidity in the System</h3>
                        <p className="text-sm text-gray-600">Daily liquidity monitoring</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Keen Eye on All Traded Instruments</h3>
                        <p className="text-sm text-gray-600">End-of-day monitoring and analysis</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Buying and Selling of Corporate Bonds</h3>
                        <p className="text-sm text-gray-600">Expert corporate bond trading</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <p className="text-gray-700 leading-relaxed mb-8">
                We have an empanelment of more than 200 entities that include commercial banks, mutual funds, primary dealers, FIIs, insurance companies and corporate. Bombay Stock Exchange has ranked Sunidhi one of the Top 3 Broking Houses (SLR Securities) for last 3 years.
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
                <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">200+</h3>
                <p className="text-gray-600">Empanelled Entities</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Top 3</h3>
                <p className="text-gray-600">BSE Ranking (3 Years)</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <FileText className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Daily</h3>
                <p className="text-gray-600">Research & Analysis</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
