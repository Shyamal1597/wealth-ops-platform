import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function WealthManagementPage() {
  return (
    <>
      <section className="bg-black text-white py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Wealth Management</h1>
            <p className="text-xl text-primary-100 mb-8">
              Personalized wealth management services to help you achieve your financial goals.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/support/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold mb-8 text-center">Our Wealth Management Services</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Portfolio management services</li>
                <li>✓ Financial planning and goal setting</li>
                <li>✓ Retirement planning</li>
                <li>✓ Tax optimization strategies</li>
                <li>✓ Estate planning support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Why Choose Us</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Experienced wealth advisors</li>
                <li>✓ Customized investment strategies</li>
                <li>✓ Regular portfolio reviews</li>
                <li>✓ Access to exclusive investment opportunities</li>
                <li>✓ Transparent fee structure</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
