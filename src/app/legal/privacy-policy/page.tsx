import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Shield, Lock, FileText, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Sunidhi Securities collects, uses, and protects your personal data, in line with the DPDP Act.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <div className="flex items-center gap-4 mb-4">
            <Shield className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl text-white">
            Your privacy and data security are our top priorities
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Key Principles */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-3">
                  <Lock className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  Confidentiality Commitment
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>&quot;Personal details imparted to us, is to be kept in strict confidentiality and to use the information only in the manner which would be beneficial to our customers.&quot;</strong>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The organization protects personal information with reasonable care to prevent unauthorized use, dissemination, or publication.
                </p>
              </CardContent>
            </Card>

            {/* Information Usage */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  Information Usage
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Service Improvement</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Personal information is utilized to enhance services and inform customers about new products or relevant offerings. Data collected is processed in the appropriate context for which it was intended, including trade request processing and settlement obligations.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Collection Scope</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Information gathering is limited to what&apos;s necessary for administering services and complying with Indian regulatory requirements. Data from multiple channels may be combined to ensure quality service delivery.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Sharing */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  Third-Party Sharing
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Conditional Disclosure</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>&quot;Under certain circumstances we may be required to share the information given by you with the third parties, where we feel they can contribute to add value.&quot;</strong>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Confidentiality Standards</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All third parties must adhere to strict confidentiality agreements. Information retention by external parties is restricted to service-related durations.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Personal information disclosure to governmental agencies and regulatory bodies occurs when legally mandated.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* External Content Disclaimer */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold leading-none tracking-tight">External Content Disclaimer</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Sunidhi provides no guarantees regarding third-party electronic content accuracy, quality, or timeliness. The organization assumes no responsibility for linked websites or their contents.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
