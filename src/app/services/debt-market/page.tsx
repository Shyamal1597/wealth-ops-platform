import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function DebtMarketPage() {
  return (
    <>
      <section className="bg-black text-white py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-8 w-8" />
              <span className="text-sm font-semibold uppercase tracking-wide">Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Debt Market
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Invest in government and corporate bonds for stable, predictable returns and portfolio diversification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/open-account">Get Started</Link>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Bond Investment Solutions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Investment Options</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Government Securities (G-Secs)</li>
                <li>✓ State Development Loans (SDLs)</li>
                <li>✓ Corporate Bonds (AAA to BBB rated)</li>
                <li>✓ Tax-Free Bonds</li>
                <li>✓ Non-Convertible Debentures (NCDs)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Benefits</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Stable and predictable income</li>
                <li>✓ Lower risk compared to equities</li>
                <li>✓ Portfolio diversification</li>
                <li>✓ Tax benefits on certain bonds</li>
                <li>✓ Expert advisory services</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
