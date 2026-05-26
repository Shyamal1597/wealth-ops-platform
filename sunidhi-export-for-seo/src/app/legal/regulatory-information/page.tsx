import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, Shield, ExternalLink, Mail } from "lucide-react";

export default function RegulatoryInformationPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <div className="flex items-center gap-4 mb-4">
            <Shield className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Regulatory Information</h1>
          </div>
          <p className="text-xl text-white">
            Compliance requirements and regulatory guidelines for investors
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* SEBI Registration Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary-600" />
                  SEBI Registration Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Stock Exchanges</h3>
                    <p className="text-gray-700"><strong>BSE/NSE/MSEI/MCX/NCDEX:</strong> INZ000169235</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Depository</h3>
                    <p className="text-gray-700"><strong>CDSL DP:</strong> IN-DP 410-2019</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Research Analyst</h3>
                    <p className="text-gray-700"><strong>Registration:</strong> INH000001329</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">FEDAI</h3>
                    <p className="text-gray-700"><strong>Member of FEDAI</strong></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Registration & KYC */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary-600" />
                  Client Registration & KYC
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Mandatory Forms</h3>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside">
                    <li>Individuals Client Registration Form for KYC Registration Agency</li>
                    <li>Non-Individuals Client Registration Form for KYC Registration Agency</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Key Requirement:</strong> &quot;SEBI vide circular no. CIR/MIRSD/16/2011 dated August 22, 2011 has replaced all the client-broker agreements, with the &apos;Rights and Obligations&apos; document&quot;
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Documentation for Derivatives Trading */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Documentation for Derivatives Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">Required supporting documents include:</p>
                <ul className="grid md:grid-cols-2 gap-2 text-gray-700 list-disc list-inside">
                  <li>ITR Acknowledgment copies</li>
                  <li>Annual account statements</li>
                  <li>Salary slips and Form 16</li>
                  <li>Networth certificates</li>
                  <li>Six-month bank statements</li>
                  <li>Demat holding statements</li>
                  <li>Asset ownership documentation</li>
                  <li>Self-declarations with evidence</li>
                </ul>
              </CardContent>
            </Card>

            {/* Regulatory Compliance Notices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-primary-600" />
                  Regulatory Compliance Notices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Key Investor Alerts</h3>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside">
                    <li><strong>&quot;Prevent unauthorised transactions in your trading / demat account → Update your mobile numbers/email IDs&quot;</strong></li>
                    <li>KYC is a one-time exercise across SEBI-registered intermediaries</li>
                    <li>Stock brokers must accept securities as margin through depository pledge only (effective September 1, 2020)</li>
                    <li>Maintain 20% upfront margin for cash market trading</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Grievance Redressal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary-600" />
                  Grievance Redressal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Email</h3>
                  <a href="mailto:complaints.redressal@sunidhi.com" className="text-primary-600 hover:text-primary-700 font-medium">
                    complaints.redressal@sunidhi.com
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">SCORES 2.0 Portal</h3>
                  <a
                    href="https://scores.sebi.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    https://scores.sebi.gov.in/
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Risk Disclosure */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900">Risk Disclosure - Derivatives Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>&quot;9 out of 10 individual traders in equity Futures and Options Segment, incurred net losses&quot;</strong>
                  </p>
                  <p className="text-gray-700">
                    Average loss-maker net trading loss: approximately <strong>Rs 50,000</strong>
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    <em>Source: SEBI study, January 2023</em>
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
