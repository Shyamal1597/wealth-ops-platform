import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, Shield, TrendingUp, CheckCircle2, Award, FileText } from "lucide-react";

export default function ForeignExchangePage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Foreign Exchange</h1>
          <p className="text-xl text-primary-100">
            Explore Interbank Forex trade for authorised foreign exchange dealers (banks) licensed by the RBI.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Sunidhi's Foreign Exchange (Forex) division was incepted in 1994. We partake in Interbank Foreign Exchange Broking, which comprises bulk deals via engagement in the over-the-counter (OTC) market; we are FEDAI certified. Sunidhi also offers Forex derivates on exchanges for retail and SME clients.
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">FEDAI Certified</h3>
                        <p className="text-sm text-gray-600">Recognized and certified by FEDAI</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">RBI Licensed Dealers</h3>
                        <p className="text-sm text-gray-600">Exclusively dealing with authorized banks</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Structured Deals</h3>
                        <p className="text-sm text-gray-600">Specialized in forward currency structured deals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Banknote className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Spot & Forwards</h3>
                        <p className="text-sm text-gray-600">Comprehensive forex trading options</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                Within Interbank Forex trade, we exclusively deal with authorised foreign exchange dealers (banks) that are authorised and licensed by the RBI. This offering is split into spot and forwards. Sunidhi also specialises in structured deals in forward currencies. We are proud to call 80% of India's certified dealers our clients.
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
                <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">1994</h3>
                <p className="text-gray-600">Division Established</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">FEDAI</h3>
                <p className="text-gray-600">Certified</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle2 className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">80%</h3>
                <p className="text-gray-600">Of India's Certified Dealers</p>
              </div>
            </div>

            <Card className="bg-white border-2 border-primary-200">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <FileText className="h-8 w-8 text-primary-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">STATEMENT OF COMMITMENT TO THE FX GLOBAL CODE</h3>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p className="mb-4">
                    Sunidhi Securities & Finance Limited has reviewed the content of the FX Global Code ("Code") and acknowledge that the Code represents a set of principles generally recognized as good practice in the wholesale foreign exchange market ("FX Market"). The Institution confirms that it acts as a Market Participant as defined by the Code, and is committed to conducting its FX Market activities ("Activities") in a manner consistent with the principles of the Code.
                  </p>
                  <p className="mb-4">
                    To this end, the Institution has taken appropriate steps, based on the size and complexity of its Activities, and the nature of its engagement in the FX Market, to align its Activities with the principles of the Code.
                  </p>
                  <p className="font-semibold">
                    Sunidhi Securities & Finance Limited<br />
                    Date: 29th March, 2018
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
