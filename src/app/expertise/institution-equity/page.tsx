import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Shield, Building2, CheckCircle2, Users, BarChart3 } from "lucide-react";

export default function InstitutionEquityPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Institution Equity (Corporate)</h1>
          <p className="text-xl text-primary-100">
            See what happens to ideas born of a stringent and contemporary in-house research methodology that are then meticulously filtered.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Sunidhi has invested in the identification of small and midcap ideas with the help of a stringent and contemporary in-house research methodology, which are then meticulously filtered. Our ideas are pegged to deliver multi-fold returns over a period of time. Our Institution Equity division caters to clients across foreign institutional investors, MFs, insurance companies, banks, and portfolio management services.
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Stringent Research Methodology</h3>
                        <p className="text-sm text-gray-600">Contemporary in-house research with meticulous filtering</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Multi-fold Returns</h3>
                        <p className="text-sm text-gray-600">Ideas designed to deliver significant returns over time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Diverse Client Base</h3>
                        <p className="text-sm text-gray-600">Serving FIIs, MFs, insurance companies, banks, and PMS</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Small & Midcap Focus</h3>
                        <p className="text-sm text-gray-600">Specialized identification of promising opportunities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                A team of research experts focuses on bringing clients the most relevant and current quality results. Sunidhi's dealing desk is always on top of a client's order and executes it through various means of communication. Our richly gifted team excels at research, sales, dealing, and post trade services.
              </p>

              <p className="text-gray-700 leading-relaxed mb-8">
                We have more than 100 institutional clients across sectors, testament to the quality and reliability of our services.
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
                <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">100+</h3>
                <p className="text-gray-600">Institutional Clients</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Expert</h3>
                <p className="text-gray-600">Research Team</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Multi-fold</h3>
                <p className="text-gray-600">Return Potential</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
