import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText, Download, ShieldAlert, TrendingDown, Users } from "lucide-react";

export default function DisclosureDisclaimerPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Disclosure & Disclaimer</h1>
          </div>
          <p className="text-xl text-white">
            Important disclosures and risk disclaimers for investors
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Download PDF */}
            <Card className="bg-gray-50 border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="h-10 w-10 text-primary-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Complete Disclaimer Document</h3>
                      <p className="text-sm text-gray-600">Download the full disclaimer and disclosure PDF</p>
                    </div>
                  </div>
                  <a
                    href="/legal-documents/SUNIDHI_DISCLAIMER_WEBSITE_Final_Aug_11_2023.pdf"
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

            {/* Research Analyst Disclosure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary-600" />
                  Research Analyst Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Registration Details</h3>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside">
                    <li>SEBI Research Analyst Registration: <strong>INH000001329</strong></li>
                    <li>Published by Sunidhi Securities & Finance Limited for private circulation</li>
                    <li>Registered Stock Broker with NSE, BSE, and MSEI</li>
                    <li>Depository Participant with CDSL</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Regulatory Compliance</h3>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside">
                    <li><strong>&quot;Sunidhi has not been debarred/suspended by SEBI or regulatory authorities&quot;</strong></li>
                    <li>Maintains Chinese walls between independent research teams</li>
                    <li>No debarment from securities market access</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Conflict of Interest Statements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <ShieldAlert className="h-6 w-6 text-primary-600" />
                  Conflict of Interest Statements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>Analyst and relatives hold no financial interest in subject companies</li>
                  <li>No compensation received for public offerings in past 12 months</li>
                  <li>No market-making activities in covered companies</li>
                  <li>Analyst not employed by subject companies</li>
                  <li>Beneficial ownership under 1% threshold maintained</li>
                </ul>
              </CardContent>
            </Card>

            {/* Report Limitations */}
            <Card>
              <CardHeader>
                <CardTitle>Report Limitations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li><strong>&quot;Not construed as solicitation or financial advice&quot;</strong></li>
                  <li><strong>&quot;No responsibility claimed for accuracy&quot;</strong></li>
                  <li>Recipients should exercise independent judgment</li>
                  <li>Opinions subject to change without notice</li>
                  <li>Past performance not indicative of future results</li>
                  <li>No liability for losses from report usage</li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sourcing */}
            <Card>
              <CardHeader>
                <CardTitle>Information Sourcing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>Based on publicly available and internal data</li>
                  <li>Not independently verified for completeness</li>
                  <li>General guidance only; not guaranteed accurate</li>
                  <li>Updates made on reasonable basis per regulations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Risk Disclosures on Derivatives */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-900">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                  Risk Disclosures on Derivatives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-3">Key Statistics (FY 2021-22)</h3>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside">
                    <li><strong>&quot;9 out of 10 individual traders in equity Futures and Options incurred net losses&quot;</strong></li>
                    <li><strong>&quot;Loss makers registered net trading loss close to Rs 50,000 on average&quot;</strong></li>
                    <li>Transaction costs: 28% of net losses for loss makers</li>
                    <li>Profitable traders: 15-50% of profits as transaction costs</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-4">
                    <em>Source: SEBI study dated January 25, 2023</em>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Investor Protection Notices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-600" />
                  Investor Protection Notices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Account Security</h3>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside">
                    <li>Update mobile numbers/email with brokers and DPs</li>
                    <li>Receive transaction information directly from exchanges</li>
                    <li>Enable smooth electronic transactions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">IPO Guidelines</h3>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside">
                    <li><strong>&quot;No need to issue cheques; authorize bank account for payment&quot;</strong></li>
                    <li>Money remains in investor account pending allotment</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">KYC Requirements</h3>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>&quot;One-time exercise across SEBI-registered intermediaries&quot;</strong>
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
