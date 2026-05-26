import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Archive, Shield, CheckCircle2, TrendingUp, FileText, Users } from "lucide-react";

export default function DepositoryServicesPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Depository Services</h1>
          <p className="text-xl text-primary-100">
            As certified and registered depository participant of CDSL SEBI, our clients have a secure and convenient way to keep track of their securities and investments digitally.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Sunidhi is a certified and registered depository participant of the Central Depository Services (India) Limited (CDSL) SEBI. We offer our clients a secure and convenient way to keep track of their securities and investments without the hassle of handling physical documents that could get lost or damaged.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Depository Services offer:</h3>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Archive className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Dematerialisation</h3>
                        <p className="text-sm text-gray-600">Converting physical shares to electronic ones</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Performance Standards</h3>
                        <p className="text-sm text-gray-600">10-minute response time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Instruction Execution</h3>
                        <p className="text-sm text-gray-600">Instruction execution for clients</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Pledge and Un-pledge Requests</h3>
                        <p className="text-sm text-gray-600">Efficient pledge management services</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <FileText className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Account Modifications</h3>
                        <p className="text-sm text-gray-600">On the same day processing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Users className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Nomination Services</h3>
                        <p className="text-sm text-gray-600">Nomination activation or change</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <p className="text-gray-700 leading-relaxed mb-8">
                We have opened 31,514 accounts and closed 14,324 accounts till December 2017.
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
                <Archive className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">31,514</h3>
                <p className="text-gray-600">Accounts Opened</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">10 Minutes</h3>
                <p className="text-gray-600">Response Time</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle2 className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Same Day</h3>
                <p className="text-gray-600">Modifications</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
