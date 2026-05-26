import Link from "next/link";
import { Calculator, TrendingUp, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function DerivativesPage() {
  return (
    <>
      <section className="bg-black text-white py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-8 w-8" />
              <span className="text-sm font-semibold uppercase tracking-wide">Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Derivatives & Commodities
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Trade Futures & Options with comprehensive research, advanced tools, and expert risk management support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/open-account">
                  Start Trading
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100" asChild>
                <Link href="/support/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Futures & Options Trading</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Index Futures & Options (Nifty, Bank Nifty, Fin Nifty)</li>
                  <li>✓ Stock Futures & Options</li>
                  <li>✓ Commodity Trading (Gold, Silver, Crude Oil, etc.)</li>
                  <li>✓ Currency Derivatives</li>
                  <li>✓ Advanced option strategies</li>
                  <li>✓ Margin calculator and risk tools</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Low brokerage and competitive margins</li>
                  <li>✓ Real-time options chain analysis</li>
                  <li>✓ Option strategy builder</li>
                  <li>✓ Volatility analysis tools</li>
                  <li>✓ Dedicated derivatives research team</li>
                  <li>✓ Risk management support</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-primary-600 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Trading Derivatives Today
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Leverage our advanced tools and expert support to maximize your trading potential
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/open-account">
                Open Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
