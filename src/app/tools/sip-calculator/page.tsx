"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export default function SIPCalculatorPage() {
  const [monthly, setMonthly] = useState("");
  const [years, setYears] = useState("");
  const [returnRate, setReturnRate] = useState("12");
  const [result, setResult] = useState<any>(null);

  const calculateSIP = () => {
    const monthlyInv = parseFloat(monthly);
    const period = parseFloat(years);
    const rate = parseFloat(returnRate);

    if (!isNaN(monthlyInv) && !isNaN(period) && !isNaN(rate)) {
      const months = period * 12;
      const monthlyRate = rate / 12 / 100;
      const futureValue = monthlyInv * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const invested = monthlyInv * months;
      const returns = futureValue - invested;

      setResult({
        invested: invested.toFixed(0),
        returns: returns.toFixed(0),
        total: futureValue.toFixed(0)
      });
    }
  };

  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-bold">SIP Calculator</h1>
          </div>
          <p className="text-xl text-primary-100">Calculate returns on systematic investment plans</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Calculate SIP Returns</CardTitle>
                <CardDescription>Plan your wealth creation journey with SIP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Investment (₹)</label>
                    <input
                      type="number"
                      value={monthly}
                      onChange={(e) => setMonthly(e.target.value)}
                      className="w-full border rounded-md px-4 py-2"
                      placeholder="Enter monthly investment"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Period (Years)</label>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full border rounded-md px-4 py-2"
                      placeholder="Enter years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expected Return Rate (% per annum)</label>
                    <input
                      type="number"
                      value={returnRate}
                      onChange={(e) => setReturnRate(e.target.value)}
                      className="w-full border rounded-md px-4 py-2"
                      placeholder="Enter expected return"
                    />
                  </div>
                  <Button onClick={calculateSIP} className="w-full">Calculate</Button>

                  {result && (
                    <div className="mt-6 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                          <p className="text-xs text-gray-600 mb-1">Invested</p>
                          <p className="text-lg font-bold text-blue-600">₹{parseInt(result.invested).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <p className="text-xs text-gray-600 mb-1">Returns</p>
                          <p className="text-lg font-bold text-green-600">₹{parseInt(result.returns).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-4 bg-primary-50 rounded-lg text-center">
                          <p className="text-xs text-gray-600 mb-1">Total Value</p>
                          <p className="text-lg font-bold text-primary-600">₹{parseInt(result.total).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
