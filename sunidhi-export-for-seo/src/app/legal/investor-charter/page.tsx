import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Shield, Users, TrendingUp, CheckCircle2, AlertCircle, Mail } from "lucide-react";

export default function InvestorCharterPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <div className="flex items-center gap-4 mb-4">
            <Shield className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Investor Charter</h1>
          </div>
          <p className="text-xl text-white">
            Your rights, responsibilities, and redressal mechanisms
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Section 1: Depository Participant (DP) */}
            <div id="depository-participant">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary-600" />
                1. Investor Charter for Depository Participants
              </h2>

              {/* Download PDF */}
              <Card className="bg-gray-50 border-gray-300 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-primary-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Depository Participant Charter</h3>
                        <p className="text-sm text-gray-600">DP ID: 23500 - Complete investor charter document</p>
                      </div>
                    </div>
                    <a
                      href="/legal-documents/Investor_charter_DP.pdf"
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

              <div className="space-y-6">
                {/* Vision & Mission */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600" />
                      Vision & Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Vision</h3>
                      <p className="text-gray-700">
                        Towards making Indian Securities Market - Transparent, Efficient, & Investor friendly by providing safe, reliable, transparent and trusted record keeping platform for investors to hold and transfer securities in dematerialized form.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Mission</h3>
                      <ul className="space-y-2 text-gray-700 list-disc list-inside">
                        <li>To hold securities of investors in dematerialised form and facilitate its transfer, while ensuring safekeeping of securities and protecting interest of investors.</li>
                        <li>To provide timely and accurate information to investors with regard to their holding and transfer of securities held by them.</li>
                        <li>To provide the highest standards of investor education, investor awareness and timely services so as to enhance Investor Protection and create awareness about Investor Rights.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Services */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Services & Timelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left p-3 font-semibold text-gray-900">Service</th>
                            <th className="text-left p-3 font-semibold text-gray-900">Timeline</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr>
                            <td className="p-3 text-gray-700">Dematerialization of securities</td>
                            <td className="p-3 text-gray-700">7 days</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">Rematerialization of securities</td>
                            <td className="p-3 text-gray-700">7 days</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">Mutual Fund Conversion / Destatementization</td>
                            <td className="p-3 text-gray-700">5 days</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">Transmission of securities</td>
                            <td className="p-3 text-gray-700">7 days</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">Registering pledge request</td>
                            <td className="p-3 text-gray-700">15 days</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">Closure of demat account</td>
                            <td className="p-3 text-gray-700">30 days</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Rights of Investors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      Rights of Investors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-700 list-disc list-inside">
                      <li>Receive a copy of KYC and account opening documents</li>
                      <li>No minimum balance required to be maintained in a demat account</li>
                      <li>No charges are payable for opening of demat accounts</li>
                      <li>Receive statement of accounts periodically</li>
                      <li>Pledge and/or any other interest or encumbrance can be created on demat holdings</li>
                      <li>Right to freeze/defreeze demat account or specific securities</li>
                      <li>Right to cast vote on various resolutions through e-Voting platform</li>
                      <li>Right to indemnification for any loss caused due to negligence of the Depository or participant</li>
                    </ul>
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
                      <h3 className="font-semibold text-gray-900 mb-2">Electronic Mode</h3>
                      <ul className="space-y-2 text-gray-700 list-disc list-inside">
                        <li>SCORES 2.0: <a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">https://scores.sebi.gov.in/</a></li>
                        <li>CDSL Portal: <a href="https://www.cdslindia.com/Footer/grievances.aspx" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">www.cdslindia.com/Footer/grievances.aspx</a></li>
                        <li>Email: <a href="mailto:complaints.redressal@sunidhi.com" className="text-primary-600 hover:text-primary-700">complaints.redressal@sunidhi.com</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">SMART ODR Platform</h3>
                      <p className="text-gray-700">
                        For online conciliation and arbitration: <a href="https://smartodr.in/login" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">https://smartodr.in/login</a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <hr className="border-t-2 border-gray-300" />

            {/* Section 2: Research Analyst (RA) */}
            <div id="research-analyst">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary-600" />
                2. Investor Charter for Research Analyst (RA)
              </h2>

              {/* Download PDF */}
              <Card className="bg-gray-50 border-gray-300 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-primary-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Research Analyst Charter</h3>
                        <p className="text-sm text-gray-600">Registration: INH000001329</p>
                      </div>
                    </div>
                    <a
                      href="/legal-documents/Investor_Charter_in_respect_of_Research_Analyst_(RA).pdf"
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

              <div className="space-y-6">
                {/* Vision & Mission */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <TrendingUp className="h-6 w-6 text-primary-600" />
                      Vision & Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Vision</h3>
                      <p className="text-gray-700">Invest with knowledge & safety.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Mission</h3>
                      <p className="text-gray-700">
                        Every investor should be able to invest in right investment products based on their needs, manage and monitor them to meet their goals, access reports and enjoy financial wellness.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Research Analyst Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-700 list-disc list-inside">
                      <li>To publish research report based on the research activities of the RA</li>
                      <li>To provide an independent unbiased view on securities</li>
                      <li>To offer unbiased recommendation, disclosing the financial interests in recommended securities</li>
                      <li>To provide research recommendation based on analysis of publicly available information</li>
                      <li>To conduct audit annually</li>
                      <li>To ensure advertisements adhere to the Advertisement Code for Research Analysts</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Rights of Investors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      Rights of Investors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-700 list-disc list-inside">
                      <li>Right to Privacy and Confidentiality</li>
                      <li>Right to Transparent Practices</li>
                      <li>Right to Fair and Equitable Treatment</li>
                      <li>Right to Adequate Information</li>
                      <li>Right to Initial and Continuing Disclosure</li>
                      <li>Right to Fair & True Advertisement</li>
                      <li>Right to be informed of the timelines for each service</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Investor Responsibilities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Users className="h-6 w-6 text-primary-600" />
                      Investor Responsibilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Do&apos;s</h3>
                      <ul className="space-y-2 text-gray-700 list-disc list-inside">
                        <li>Always deal with SEBI registered Research Analyst</li>
                        <li>Ensure that the Research Analyst has a valid registration certificate</li>
                        <li>Always pay attention towards disclosures made in research reports before investing</li>
                        <li>Pay your Research Analyst through banking channels only</li>
                        <li>Ask all relevant questions and clear your doubts before acting on recommendation</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Don&apos;ts</h3>
                      <ul className="space-y-2 text-gray-700 list-disc list-inside">
                        <li>Do not provide funds for investment to the Research Analyst</li>
                        <li>Don&apos;t fall prey to luring advertisements or market rumours</li>
                        <li>Do not get attracted to limited period discount or other incentives, gifts, etc.</li>
                        <li>Do not share login credentials and password of your trading, demat or bank accounts</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <hr className="border-t-2 border-gray-300" />

            {/* Section 3: Investor Complaints Data */}
            <div id="investor-complaints">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-primary-600" />
                3. Investor Complaints Data - Depository Participant
              </h2>

              {/* Download PDF */}
              <Card className="bg-gray-50 border-gray-300 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-primary-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Investor Complaints Report</h3>
                        <p className="text-sm text-gray-600">Monthly complaint resolution data</p>
                      </div>
                    </div>
                    <a
                      href="/legal-documents/1679937760Investor_complaints_Depository_Participant_Sunidhi.pdf"
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

              <div className="space-y-6">
                {/* Company Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-gray-700"><strong>Company:</strong> Sunidhi Securities & Finance Ltd</p>
                    <p className="text-gray-700"><strong>DP ID:</strong> 23500 (IN-DP-410-2019)</p>
                    <p className="text-gray-700"><strong>CIN:</strong> U67190MH1985PLC037326</p>
                    <p className="text-gray-700"><strong>Website:</strong> <a href="https://www.sunidhi.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">www.sunidhi.com</a></p>
                    <p className="text-gray-700"><strong>Address:</strong> Kalpataru Inspire, 8th Floor, Off. Western Express Highway, Opp. Grand Hyatt Hotel, Santacruz (East), Mumbai 400055</p>
                    <p className="text-gray-700"><strong>Tel:</strong> +91 22 66771777</p>
                  </CardContent>
                </Card>

                {/* 5-Year Complaints Data */}
                <Card>
                  <CardHeader>
                    <CardTitle>Historical Complaints Data (Last 5 Years)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left p-3 font-semibold text-gray-900">Year</th>
                            <th className="text-left p-3 font-semibold text-gray-900">Carried Forward</th>
                            <th className="text-left p-3 font-semibold text-gray-900">Received</th>
                            <th className="text-left p-3 font-semibold text-gray-900">Resolved</th>
                            <th className="text-left p-3 font-semibold text-gray-900">Pending</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr>
                            <td className="p-3 text-gray-700">2020-21</td>
                            <td className="p-3 text-gray-700">NIL</td>
                            <td className="p-3 text-gray-700">2</td>
                            <td className="p-3 text-gray-700">2</td>
                            <td className="p-3 text-gray-700">NIL</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">2021-22</td>
                            <td className="p-3 text-gray-700">NIL</td>
                            <td className="p-3 text-gray-700">1</td>
                            <td className="p-3 text-gray-700">1</td>
                            <td className="p-3 text-gray-700">NIL</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">2022-23</td>
                            <td className="p-3 text-gray-700">NIL</td>
                            <td className="p-3 text-gray-700">2</td>
                            <td className="p-3 text-gray-700">2</td>
                            <td className="p-3 text-gray-700">NIL</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">2023-24</td>
                            <td className="p-3 text-gray-700">NIL</td>
                            <td className="p-3 text-gray-700">2</td>
                            <td className="p-3 text-gray-700">2</td>
                            <td className="p-3 text-gray-700">NIL</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">2024-25</td>
                            <td className="p-3 text-gray-700">NIL</td>
                            <td className="p-3 text-gray-700">3</td>
                            <td className="p-3 text-gray-700">3</td>
                            <td className="p-3 text-gray-700">NIL</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">2025-26</td>
                            <td className="p-3 text-gray-700">NIL</td>
                            <td className="p-3 text-gray-700">NIL</td>
                            <td className="p-3 text-gray-700">NIL</td>
                            <td className="p-3 text-gray-700">NIL</td>
                          </tr>
                          <tr className="bg-gray-50 font-semibold">
                            <td className="p-3 text-gray-900">Grand Total</td>
                            <td className="p-3 text-gray-900">NIL</td>
                            <td className="p-3 text-gray-900">10</td>
                            <td className="p-3 text-gray-900">10</td>
                            <td className="p-3 text-gray-900">NIL</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      * All complaints received have been resolved with 100% resolution rate
                    </p>
                  </CardContent>
                </Card>

                {/* Performance Highlights */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-900">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      Performance Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-700 list-disc list-inside">
                      <li><strong>100% Complaint Resolution Rate</strong> - All received complaints have been resolved</li>
                      <li><strong>Zero Pending Complaints</strong> - No complaints remain unresolved</li>
                      <li><strong>Consistent Performance</strong> - Maintained excellent resolution record across all years</li>
                      <li><strong>Current Status:</strong> No pending complaints as of November 2025</li>
                    </ul>
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
