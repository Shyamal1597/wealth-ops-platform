"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export default function MarginCalculatorPage() {
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateMargin = () => {
    const qty = parseFloat(quantity);
    const prc = parseFloat(price);
    if (!isNaN(qty) && !isNaN(prc)) {
      // Simplified margin calculation (20% of total value)
      const margin = (qty * prc * 0.20);
      setResult(margin);
    }
  };

  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Margin Calculator</h1>
          </div>
          <p className="text-xl text-primary-100">Calculate margin requirements for your trades</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Calculate Margin Required</CardTitle>
                <CardDescription>Enter trade details to calculate required margin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full border rounded-md px-4 py-2"
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price per unit</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full border rounded-md px-4 py-2"
                      placeholder="Enter price"
                    />
                  </div>
                  <Button onClick={calculateMargin} className="w-full">Calculate</Button>

                  {result !== null && (
                    <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Required Margin</p>
                      <p className="text-3xl font-bold text-primary-600">
                        ₹{result.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> This is a simplified calculator for demonstration.
                Actual margin requirements vary based on stock, segment, and market conditions.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
