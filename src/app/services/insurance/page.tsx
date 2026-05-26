import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function InsurancePage() {
  return (
    <>
      <section className="bg-black text-white py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Insurance Solutions</h1>
            <p className="text-xl text-primary-100 mb-8">
              Comprehensive insurance solutions to protect what matters most to you and your family.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/open-account">Get a Quote</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold mb-8 text-center">Our Insurance Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Life Insurance</h3>
              <p className="text-gray-600">Secure your family's financial future with comprehensive life insurance plans.</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Health Insurance</h3>
              <p className="text-gray-600">Protect yourself and your loved ones from medical expenses.</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">General Insurance</h3>
              <p className="text-gray-600">Vehicle, home, and travel insurance solutions.</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
