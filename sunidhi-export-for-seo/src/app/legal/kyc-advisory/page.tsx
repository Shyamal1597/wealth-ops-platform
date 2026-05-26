import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, CheckCircle2, Download, Calendar } from "lucide-react";

export default function KYCAdvisoryPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <div className="flex items-center gap-4 mb-4">
            <FileText className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Advisory - KYC Compliance</h1>
          </div>
          <p className="text-xl text-white">
            Important information about KYC compliance requirements
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Download PDF */}
            <Card className="bg-gray-50 border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <FileText className="h-10 w-10 text-primary-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">KYC Advisory Document</h3>
                      <p className="text-sm text-gray-600">Download the complete KYC compliance advisory</p>
                    </div>
                  </div>
                  <a
                    href="/legal-documents/Annexure-I-Advisory-for-KYC-updation.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    View PDF
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-yellow-900">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                  Important KYC Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                  <p className="text-gray-700 leading-relaxed">
                    All investors are requested to take note that <strong>6 KYC attributes</strong> have been made mandatory:
                  </p>
                  <div className="grid md:grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">PAN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Address</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Mobile Number</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Email ID</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Income Range</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-4">
                    Investors availing custodian services will be additionally required to update the custodian details.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Deadline */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-900">
                  <Calendar className="h-6 w-6 text-red-600" />
                  Compliance Deadline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  The last date to update KYC was <strong>March 31, 2022</strong>.
                </p>
              </CardContent>
            </Card>

            {/* Consequences of Non-Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-primary-600" />
                  Consequences of Non-Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full mt-1">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Trading Accounts</h3>
                      <p className="text-gray-700">Non-compliant trading accounts will be blocked for trading by the Exchange.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full mt-1">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Demat Accounts</h3>
                      <p className="text-gray-700">Non-compliant demat accounts will be frozen for debits by Depository Participant or Depository.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How to Reactivate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  How to Reactivate Your Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">For Trading Accounts</h3>
                  <p className="text-gray-700 leading-relaxed">
                    On submission of the necessary information to the stockbroker and updation of the same by the stockbroker in the Exchange systems and approval by the Exchange, the blocked trading accounts shall be unblocked by the Exchange on <strong>T+1 trading day</strong>.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">For Demat Accounts</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The demat account shall be unfreezed once the investor submits the deficient KYC details and the same is captured by the depository participant in the depository system.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Important Advice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">Important Advice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  To ensure smooth settlement of trades, the investors are requested to ensure that <strong>both the trading and demat accounts are compliant</strong> with respect to the KYC requirement.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The investors are hereby requested to comply with the regulatory guidelines issued by Exchanges and Depositories from time to time with regard to KYC compliance and related requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
