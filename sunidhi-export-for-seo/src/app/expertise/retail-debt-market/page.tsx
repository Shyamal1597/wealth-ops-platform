import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Shield, CheckCircle2, TrendingUp, Award, Users } from "lucide-react";

export default function RetailDebtMarketPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Retail Debt Market</h1>
          <p className="text-xl text-primary-100">
            Learn about products that are tailor-made for the long-term investor who wishes to earn a steady income in the years to come.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Sunidhi's Wholesale Debt Market offering has continually garnered expertise and clients since the past few years. This has made us specialists when it comes to the procurement of the best rates in the Retail Debt Market (RDM) too.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our RDM division was incepted in March 2017. In less than a year, it proudly includes 150 investors, and counting, comprising HNIs, PFs and charitable trusts. Our products are tailor-made for the long-term investor who wishes to earn a steady income in the years to come.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Sunidhi's diverse range of offerings in RDM includes:</h3>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <FileText className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Non-convertible Debentures</h3>
                        <p className="text-sm text-gray-600">Fixed income securities with regular interest payments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Preference Shares</h3>
                        <p className="text-sm text-gray-600">Hybrid securities with preference in dividend distribution</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Tax-free Bonds</h3>
                        <p className="text-sm text-gray-600">Bonds offering tax-free interest income</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Perpetual Bonds</h3>
                        <p className="text-sm text-gray-600">Bonds with no maturity date</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Zero Coupon Bonds</h3>
                        <p className="text-sm text-gray-600">Bonds issued at discount with no periodic interest</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">150+</h3>
                <p className="text-gray-600">Investors</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">March 2017</h3>
                <p className="text-gray-600">Inception</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <FileText className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">5</h3>
                <p className="text-gray-600">Product Types</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
