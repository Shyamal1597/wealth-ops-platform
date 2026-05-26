"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";

export default function DownloadsPage() {
  const externalUrl = "https://wekart.co.in/APP_ADDONS/SunidhiSecurities/";

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = externalUrl;
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = () => {
    window.location.href = externalUrl;
  };

  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Downloads & Forms</h1>
          <p className="text-xl text-primary-100">Access all important forms and documents</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <FileText className="h-16 w-16 text-primary-600 mx-auto mb-6" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Redirecting to Downloads Portal
              </h2>

              <p className="text-gray-600 mb-6">
                You are being redirected to our downloads portal where you can access all forms, documents, and important files.
              </p>

              <div className="bg-gray-50 rounded-md p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Destination URL:</p>
                <p className="text-sm font-mono text-primary-600 break-all">{externalUrl}</p>
              </div>

              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={handleRedirect}
                  className="w-full sm:w-auto"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Go to Downloads Portal Now
                </Button>

                <p className="text-sm text-gray-500">
                  You will be automatically redirected in a few seconds...
                </p>
              </div>
            </div>

            <div className="mt-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Downloads Include:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Account Opening Forms</h4>
                  <ul className="space-y-1">
                    <li>• Individual Account Opening</li>
                    <li>• NRI Account Opening</li>
                    <li>• Corporate Account Forms</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">KYC Documents</h4>
                  <ul className="space-y-1">
                    <li>• KYC Modification Forms</li>
                    <li>• Voluntary Declaration Forms</li>
                    <li>• Address Change Requests</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Trading Guides</h4>
                  <ul className="space-y-1">
                    <li>• Platform User Guides</li>
                    <li>• Mobile App Instructions</li>
                    <li>• Trading Tutorials</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Other Forms</h4>
                  <ul className="space-y-1">
                    <li>• Demat Account Forms</li>
                    <li>• Power of Attorney</li>
                    <li>• Nomination Forms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
