import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, TrendingUp, Shield, CheckCircle2, Award, Users, Briefcase, Building2 } from "lucide-react";

export default function MutualFundDistributionPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mutual Fund Distribution</h1>
          <p className="text-xl text-primary-100">
            With in-depth expertise as a certified professional Mutual Fund Distributor, we aid clients to fulfill short- and long-term investment goals.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Sunidhi has in-depth expertise and years of experience as a certified professional Mutual Fund Distributor. We have been instrumental in aiding our clients' short- and long-term investment goals efficiently. Our mission is to provide quality and cost effective services to help clients achieve these targets.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Sunidhi's winning strategy lies in the selection of the right mutual fund products. A few factors that are considered during this rigorous process are:</h3>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Investment Objective and Strategy</h3>
                        <p className="text-sm text-gray-600">Aligned with your financial goals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Users className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Fund Manager's Track Record</h3>
                        <p className="text-sm text-gray-600">Proven expertise and performance history</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
                        <p className="text-sm text-gray-600">Consistent returns across market cycles</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Quality of the Portfolio</h3>
                        <p className="text-sm text-gray-600">High-quality underlying securities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <PieChart className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Fund Size</h3>
                        <p className="text-sm text-gray-600">Optimal assets under management</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Ratings</h3>
                        <p className="text-sm text-gray-600">Top-rated funds from rating agencies</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Fund House Pedigree</h3>
                        <p className="text-sm text-gray-600">Reputable and established AMCs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Awards</h3>
                        <p className="text-sm text-gray-600">Recognition and industry accolades</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                We continually build a relationship of trust and comfort with our clients through robust back office support and execution skills par excellence. Our primary execution offering include CPR 1-3 ranked funds. We consciously refrain from distributing sector-specific or theme-based funds. We remain current and relevant in our selection of funds through constant feedback and updates from AMCs. Sunidhi distributes to 1500 individuals, 200 HNIs, and 50 corporate clients through a team of senior relationship managers, client support executives, and back office operations.
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">1500</h3>
                <p className="text-gray-600">Individuals</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">200</h3>
                <p className="text-gray-600">HNIs</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Briefcase className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">50</h3>
                <p className="text-gray-600">Corporate Clients</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
