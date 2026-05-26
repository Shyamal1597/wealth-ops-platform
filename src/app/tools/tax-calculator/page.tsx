import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export default function TaxCalculatorPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Tax Calculator</h1>
          </div>
          <p className="text-xl text-primary-100">Calculate capital gains tax on your investments</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Tax Calculator - Coming Soon</CardTitle>
                <CardDescription>Interactive tax calculator will be available soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Key Tax Information:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Short Term Capital Gains (STCG)</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Equity: 15% (holding period {'<'} 1 year)</li>
                        <li>• Debt: As per income tax slab</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Long Term Capital Gains (LTCG)</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Equity: 10% above ₹1 lakh (holding period ≥ 1 year)</li>
                        <li>• Debt: 20% with indexation benefit</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
