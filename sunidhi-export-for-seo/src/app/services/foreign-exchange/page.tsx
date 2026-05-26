import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ForexPage() {
  return (
    <>
      <section className="bg-black text-white py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Foreign Exchange</h1>
            <p className="text-xl text-primary-100 mb-8">
              Trade currency pairs with competitive spreads and expert market insights.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/open-account">Start Trading</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Currency Trading Services</h2>
            <p className="text-gray-600 mb-6">
              Trade major currency pairs including USD/INR, EUR/INR, GBP/INR, and JPY/INR with our advanced trading platforms.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Real-time forex rates</li>
              <li>✓ Low transaction costs</li>
              <li>✓ Expert market analysis</li>
              <li>✓ Risk management tools</li>
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
