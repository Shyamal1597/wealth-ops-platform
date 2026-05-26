import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, TrendingUp, Shield, CheckCircle2, Award, Briefcase, Phone, Mail, User, ArrowDown, ChevronRight, ChevronDown } from "lucide-react";

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

      {/* Escalation Matrix Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <Container>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Escalation Matrix</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                At Sunidhi Capital, we are committed to resolving your concerns promptly.
                Please follow the escalation levels below.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-4 relative">

              {/* Level 1 - Entry */}
              <div className="w-full md:w-1/3 relative z-10 flex flex-col">
                <Card className="relative bg-white border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between min-h-[320px]">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg z-10 uppercase tracking-wide whitespace-nowrap">
                    Level 1
                  </div>
                  <CardContent className="p-8 text-center pt-12 flex flex-col h-full justify-center">
                    <div className="mb-4 inline-block p-3 bg-gray-100 rounded-full text-gray-600 mx-auto">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nodal Officer</p>
                      <a href="mailto:support@sunidhi.com" className="text-primary-600 hover:text-primary-800 font-bold block text-lg transition-colors lowercase break-words">
                        support@sunidhi.com
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Arrow 1 */}
              <div className="flex flex-col items-center justify-center z-0 select-none self-center py-4 md:py-0">
                <div className="hidden md:flex items-center justify-center bg-gray-100 rounded-full p-3 shadow-md border border-gray-200 transform hover:scale-110 transition-transform">
                  <ChevronRight className="h-8 w-8 text-gray-700" strokeWidth={3} />
                </div>
                <div className="md:hidden flex items-center justify-center bg-gray-100 rounded-full p-3 shadow-md border border-gray-200 animate-bounce">
                  <ArrowDown className="h-6 w-6 text-gray-700" strokeWidth={3} />
                </div>
              </div>

              {/* Level 2 - Higher */}
              <div className="w-full md:w-1/3 relative z-10 flex flex-col">
                <Card className="relative bg-white border-primary-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform scale-100 border-t-4 border-t-primary-500 h-full flex flex-col justify-between min-h-[320px]">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg z-10 uppercase tracking-wide whitespace-nowrap flex items-center gap-2">
                    Level 2 <TrendingUp size={14} className="text-primary-200" />
                  </div>
                  <CardContent className="p-8 text-center pt-12 flex flex-col h-full justify-center">
                    <div className="mb-4 inline-block p-3 bg-primary-50 rounded-full text-primary-600 mx-auto">
                      <User className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grievance Officer</p>
                      <p className="font-bold text-gray-900 text-lg">Nikhil Rasal</p>
                      <a href="mailto:nikhil.r@sunidhi.com" className="text-primary-600 hover:text-primary-800 font-medium block transition-colors lowercase break-words">
                        nikhil.r@sunidhi.com
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Arrow 2 */}
              <div className="flex flex-col items-center justify-center z-0 select-none self-center py-4 md:py-0">
                <div className="hidden md:flex items-center justify-center bg-gray-100 rounded-full p-3 shadow-md border border-gray-200 transform hover:scale-110 transition-transform">
                  <ChevronRight className="h-8 w-8 text-gray-700" strokeWidth={3} />
                </div>
                <div className="md:hidden flex items-center justify-center bg-gray-100 rounded-full p-3 shadow-md border border-gray-200 animate-bounce">
                  <ArrowDown className="h-6 w-6 text-gray-700" strokeWidth={3} />
                </div>
              </div>

              {/* Level 3 - Highest */}
              <div className="w-full md:w-1/3 relative z-10 flex flex-col">
                <Card className="relative bg-gradient-to-b from-white to-amber-50 border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform scale-100 border-t-4 border-t-amber-500 h-full flex flex-col justify-between min-h-[320px]">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-8 py-2 rounded-full text-base font-bold shadow-lg z-10 uppercase tracking-wide whitespace-nowrap flex items-center gap-2">
                    Level 3 <Award size={16} className="text-white" />
                  </div>
                  <CardContent className="p-6 text-center pt-12 flex flex-col h-full justify-center">
                    <div className="mb-4 inline-block p-3 bg-amber-100 rounded-full text-amber-600 mx-auto">
                      <Building2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Principal Nodal Officer</p>
                      <p className="font-bold text-gray-900 text-xl">Mahesh Desai</p>
                      <a href="mailto:mahesh.desai@sunidhi.com" className="text-primary-600 hover:text-primary-800 font-medium block transition-colors lowercase break-words">
                        mahesh.desai@sunidhi.com
                      </a>
                      <div className="mt-4 pt-4 border-t border-amber-100">
                        <p className="text-xs text-amber-700 uppercase tracking-wider mb-1 font-semibold">Board No.</p>
                        <p className="font-bold text-gray-900 text-lg">(+91-22) 66771777</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
