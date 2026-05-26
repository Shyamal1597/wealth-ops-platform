import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, TrendingUp, Shield, CheckCircle2, Award, Briefcase, Phone, Mail, User } from "lucide-react";

export default function SunidhiCapitalPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sunidhi Capital Pvt Ltd (NBFC)</h1>
          <p className="text-xl text-primary-100">
            We have a capital solution for your every lending need.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Sunidhi Capital is a non-deposit accepting Non-Banking Finance Company (NBFC) registered with the Reserve Bank of India. Our products enable various lending needs.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Capital Offerings Include:</h3>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Security-backed Financing</h3>
                        <p className="text-sm text-gray-600">
                          Loans against shares are offered against select securities such as listed shares, mutual funds or bonds. Our clients can leverage their investments to meet contingencies or finance market opportunities. As part of margin funding, we also accept select securities as margins. In this way, clients can increase their investment exposure to securities and improve returns.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Promoter Funding</h3>
                        <p className="text-sm text-gray-600">
                          We provide funds against promoter shares in select companies.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">IPO Funding</h3>
                        <p className="text-sm text-gray-600">
                          We provide IPO financing as a short-term loan to retail investors.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Personal Micro Loans</h3>
                        <p className="text-sm text-gray-600">
                          We provide micro loans with minimal documentation and quick disbursals for short duration via an app. This is a seamless mobile lending experience.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-12">
                Sunidhi Capital offers a truly unique borrowing experience because you can:
              </h3>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Customise Your Loan Product</h4>
                        <p className="text-sm text-gray-600">Tailor-made to suit your borrowing needs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Transparency in Business Dealings</h4>
                        <p className="text-sm text-gray-600">Clear and honest communication</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Small-sized Loans Online</h4>
                        <p className="text-sm text-gray-600">Available across the country</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Innovative & Flexible Credit Products</h4>
                        <p className="text-sm text-gray-600">Meet all your financial needs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Zero to Minimal Pre-payment Charges</h4>
                        <p className="text-sm text-gray-600">Flexible repayment options</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Trusted Brand</h4>
                        <p className="text-sm text-gray-600">Invest with confidence in the market</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Information</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Queries */}
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Phone className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">For Sunidhi Capital Queries</h3>
                    <p className="text-sm text-gray-600">(NBFC – Loans and Repayments)</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 justify-center">
                      <Phone className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="font-medium text-gray-900">(+91-22) 66771777</p>
                        <p className="font-medium text-gray-900">(+91-22) 43222777</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <Mail className="h-5 w-5 text-primary-600" />
                      <a href="mailto:support@sunidhi.com" className="text-primary-600 hover:text-primary-700 font-medium">
                        support@sunidhi.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grievances */}
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <User className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">For Sunidhi Capital Grievances</h3>
                    <p className="text-sm text-gray-600">(NBFC – Loans and Repayments)</p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 mb-1">Grievance Officer</p>
                      <p className="text-gray-700">Nikhil Rasal</p>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <Phone className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="font-medium text-gray-900">(+91-22) 66771777</p>
                        <p className="font-medium text-gray-900">(+91-22) 43222777</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <Mail className="h-5 w-5 text-primary-600" />
                      <a href="mailto:nikhil.r@sunidhi.com" className="text-primary-600 hover:text-primary-700 font-medium">
                        nikhil.r@sunidhi.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-50 p-6 rounded-lg">
                <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">RBI</h3>
                <p className="text-gray-600">Registered NBFC</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <Briefcase className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">4+</h3>
                <p className="text-gray-600">Product Offerings</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Trusted</h3>
                <p className="text-gray-600">Market Leader</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
