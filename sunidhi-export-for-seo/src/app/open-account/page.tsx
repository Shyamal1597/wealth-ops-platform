import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Shield } from "lucide-react";

export default function OpenAccountPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Open Trading Account</h1>
          <p className="text-xl text-primary-100">Start your investment journey in just 10 minutes</p>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-4 items-start">
              <CheckCircle className="h-10 w-10 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Zero Account Opening Fee</h3>
                <p className="text-sm text-gray-600">Open your account completely free</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Clock className="h-10 w-10 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Quick & Easy Process</h3>
                <p className="text-sm text-gray-600">Complete eKYC in 10-15 minutes</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Shield className="h-10 w-10 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">100% Secure</h3>
                <p className="text-sm text-gray-600">Bank-grade security for your data</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Account Types */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Account Type</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary-600 transition-colors">
              <CardHeader>
                <CardTitle>eKYC (Video)</CardTitle>
                <CardDescription>Open account with video verification</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>✓ Fastest method (10-15 mins)</li>
                  <li>✓ Video call verification</li>
                  <li>✓ Instant activation</li>
                  <li>✓ PAN + Aadhaar required</li>
                </ul>
                <Button className="w-full">Start eKYC</Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary-600 transition-colors">
              <CardHeader>
                <CardTitle>Offline</CardTitle>
                <CardDescription>Submit documents physically</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>✓ Visit nearest branch</li>
                  <li>✓ Personal assistance</li>
                  <li>✓ Document verification</li>
                  <li>✓ Activation in 24-48 hrs</li>
                </ul>
                <Button variant="outline" className="w-full">Find Branch</Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary-600 transition-colors">
              <CardHeader>
                <CardTitle>NRI Account</CardTitle>
                <CardDescription>For Non-Resident Indians</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>✓ Special NRI account</li>
                  <li>✓ PIS approval support</li>
                  <li>✓ Repatriation benefits</li>
                  <li>✓ Overseas address proof</li>
                </ul>
                <Button variant="outline" className="w-full">Apply for NRI</Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What You Need</h2>

            <Card>
              <CardHeader>
                <CardTitle>Documents Required</CardTitle>
                <CardDescription>Keep these documents ready for quick account opening</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Identity Proof</h4>
                    <p className="text-sm text-gray-600">PAN Card (mandatory)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Address Proof</h4>
                    <p className="text-sm text-gray-600">Aadhaar Card / Passport / Driving License / Voter ID</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Bank Details</h4>
                    <p className="text-sm text-gray-600">Cancelled cheque or bank statement (not older than 3 months)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Other</h4>
                    <p className="text-sm text-gray-600">
                      • Passport size photograph<br />
                      • Income proof (for derivatives segment)<br />
                      • Signature on white paper
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container>
          <div className="bg-primary-600 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Investing?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied investors. Open your account today!
            </p>
            <Button size="lg" variant="secondary">
              Open Free Account Now
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
