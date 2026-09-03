"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";

type SegmentType = "equity-delivery" | "equity-intraday" | "fo-futures" | "fo-options";
type ExchangeType = "NSE" | "BSE";

interface CalculationResult {
  turnover: number;
  brokerage: number;
  exchangeCharges: number;
  sebiCharges: number;
  stt: number;
  stampDuty: number;
  gst: number;
  totalCharges: number;
  breakeven: number;
  netPL: number;
}

export default function BrokerageCalculatorPage() {
  const [activeSegment, setActiveSegment] = useState<SegmentType>("equity-delivery");
  const [exchange, setExchange] = useState<ExchangeType>("NSE");

  // Common inputs
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brokerageSlab, setBrokerageSlab] = useState("0.03");

  // Delivery/Intraday options
  const [equityDeliveryType, setEquityDeliveryType] = useState<"delivery" | "intraday">("delivery");
  const [foSettlementType, setFoSettlementType] = useState<"intraday" | "carry">("intraday");

  // Options specific
  const [strikePrice, setStrikePrice] = useState("");

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(true);

  const calculateCharges = () => {
    const buy = parseFloat(buyPrice) || 0;
    const sell = parseFloat(sellPrice) || 0;
    const qty = parseFloat(quantity) || 0;
    const strike = parseFloat(strikePrice) || 0;

    if (qty === 0) return;

    const isDeliveryOrCarry =
      (activeSegment === "equity-delivery" && equityDeliveryType === "delivery") ||
      ((activeSegment === "fo-futures" || activeSegment === "fo-options") && foSettlementType === "carry");

    if (isDeliveryOrCarry) {
      if (buy === 0 && sell === 0) return;
    } else {
      if (buy === 0 || sell === 0) return;
    }

    let buyValue = buy * qty;
    let sellValue = sell * qty;
    let turnover = buyValue + sellValue;

    if (isDeliveryOrCarry) {
      if (buy === 0 && sell > 0) {
        buyValue = 0;
        sellValue = sell * qty;
        turnover = sellValue;
      } else if (sell === 0 && buy > 0) {
        buyValue = buy * qty;
        sellValue = 0;
        turnover = buyValue;
      }
    }

    const brokeragePercent = Math.min(parseFloat(brokerageSlab) || 0, 1);
    const brokerage = (turnover * brokeragePercent) / 100;
    let exchangeCharges = 0;
    let sebiCharges = 0;
    let stt = 0;
    let stampDuty = 0;

    switch (activeSegment) {
      case "equity-delivery":
        if (exchange === "NSE") {
          exchangeCharges = turnover * 0.0000307;
        } else {
          exchangeCharges = turnover * 0.0000375;
        }
        sebiCharges = (turnover / 10000000) * 10;
        if (equityDeliveryType === "delivery") {
          stt = (buyValue * 0.001) + (sellValue * 0.001);
        } else {
          stt = sellValue * 0.00025;
        }
        if (equityDeliveryType === "delivery") {
          stampDuty = Math.min(turnover * 0.00015, (turnover / 10000000) * 1500);
        } else {
          stampDuty = Math.min(turnover * 0.00003, (turnover / 10000000) * 300);
        }
        break;

      case "equity-intraday":
        if (exchange === "NSE") {
          exchangeCharges = turnover * 0.0000307;
        } else {
          exchangeCharges = turnover * 0.0000375;
        }
        sebiCharges = (turnover / 10000000) * 10;
        stt = sellValue * 0.00025;
        stampDuty = Math.min(turnover * 0.00003, (turnover / 10000000) * 300);
        break;

      case "fo-futures":
        if (exchange === "NSE") {
          exchangeCharges = turnover * 0.0000183;
        } else {
          exchangeCharges = 0;
        }
        sebiCharges = (turnover / 10000000) * 10;
        if (foSettlementType === "intraday") {
          stt = sellValue * 0.0002;
        } else {
          stt = sellValue * 0.0002;
        }
        stampDuty = Math.min(turnover * 0.00002, (turnover / 10000000) * 200);
        break;

      case "fo-options":
        const premium = sell;
        const premiumTurnover = premium * qty;
        exchangeCharges = premiumTurnover * 0.0003553;
        sebiCharges = (premiumTurnover / 10000000) * 10;
        if (foSettlementType === "intraday") {
          stt = premiumTurnover * 0.001;
        } else {
          const intrinsicValue = Math.max(0, strike - buy) * qty;
          stt = intrinsicValue * 0.00125;
        }
        stampDuty = Math.min(premiumTurnover * 0.00003, (premiumTurnover / 10000000) * 300);
        break;
    }

    const gst = (brokerage + sebiCharges + exchangeCharges) * 0.18;
    const totalCharges = brokerage + exchangeCharges + sebiCharges + stt + stampDuty + gst;

    let grossPL = 0;
    let netPL = 0;
    let breakeven = 0;

    if (buy > 0 && sell > 0) {
      grossPL = (sell - buy) * qty;
      netPL = grossPL - totalCharges;
      const chargesPerShare = totalCharges / qty;
      breakeven = buy + chargesPerShare;
    } else if (buy > 0 && sell === 0) {
      netPL = -(buyValue + totalCharges);
      breakeven = 0;
    } else if (sell > 0 && buy === 0) {
      netPL = sellValue - totalCharges;
      breakeven = 0;
    }

    setResult({
      turnover: activeSegment === "fo-options" ? sell * qty : turnover,
      brokerage,
      exchangeCharges,
      sebiCharges,
      stt,
      stampDuty,
      gst,
      totalCharges,
      breakeven,
      netPL,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const segments = [
    { id: "equity-delivery" as SegmentType, label: "Equity Delivery" },
    { id: "equity-intraday" as SegmentType, label: "Equity Intraday" },
    { id: "fo-futures" as SegmentType, label: "F&O Futures" },
    { id: "fo-options" as SegmentType, label: "F&O Options" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Brokerage Calculator</h1>
          </div>
          <p className="text-xl text-primary-100">Calculate brokerage, taxes, and charges for your trades</p>
        </Container>
      </section>

      {/* Calculator Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Segment Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Trading Segment</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {segments.map((segment) => (
                  <button
                    key={segment.id}
                    onClick={() => {
                      setActiveSegment(segment.id);
                      setResult(null);
                      setBuyPrice("");
                      setSellPrice("");
                      setQuantity("");
                      setStrikePrice("");
                      setBrokerageSlab("0.03");
                      setEquityDeliveryType("delivery");
                      setFoSettlementType("intraday");
                    }}
                    className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      activeSegment === segment.id
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {segment.label}
                  </button>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Trade Details</CardTitle>
                <CardDescription>Enter your trade information to calculate charges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Brokerage Slab */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Brokerage (% of turnover)</label>
                    <input
                      type="number"
                      value={brokerageSlab}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value <= 1 || e.target.value === "") {
                          setBrokerageSlab(e.target.value);
                        }
                      }}
                      max="1"
                      step="0.01"
                      className="w-full border rounded-md px-4 py-2"
                      placeholder="0.03"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum allowed: 1%</p>
                  </div>

                  {/* Trade Type for Equity Delivery */}
                  {activeSegment === "equity-delivery" && (
                    <div>
                      <label className="block text-sm font-medium mb-3">Trade Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setEquityDeliveryType("delivery")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            equityDeliveryType === "delivery"
                              ? "bg-primary-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Delivery
                        </button>
                        <button
                          onClick={() => setEquityDeliveryType("intraday")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            equityDeliveryType === "intraday"
                              ? "bg-primary-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Intraday
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Settlement Type for F&O */}
                  {(activeSegment === "fo-futures" || activeSegment === "fo-options") && (
                    <div>
                      <label className="block text-sm font-medium mb-3">Settlement Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setFoSettlementType("intraday")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            foSettlementType === "intraday"
                              ? "bg-primary-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Intraday
                        </button>
                        <button
                          onClick={() => setFoSettlementType("carry")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            foSettlementType === "carry"
                              ? "bg-primary-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {activeSegment === "fo-options" ? "Exercise" : "Carry"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Exchange Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Exchange</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setExchange("NSE")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          exchange === "NSE"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        NSE
                      </button>
                      <button
                        onClick={() => setExchange("BSE")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          exchange === "BSE"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        BSE
                      </button>
                    </div>
                  </div>

                  {/* Price Inputs */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Buy Price {activeSegment === "fo-options" && "(Premium)"}
                      </label>
                      <input
                        type="number"
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                        className="w-full border rounded-md px-4 py-2"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Sell Price {activeSegment === "fo-options" && "(Premium)"}
                      </label>
                      <input
                        type="number"
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                        className="w-full border rounded-md px-4 py-2"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full border rounded-md px-4 py-2"
                      placeholder="0"
                      step="1"
                    />
                  </div>

                  {/* Strike Price for Options */}
                  {activeSegment === "fo-options" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Strike Price</label>
                      <input
                        type="number"
                        value={strikePrice}
                        onChange={(e) => setStrikePrice(e.target.value)}
                        className="w-full border rounded-md px-4 py-2"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  )}

                  {/* Calculate Button */}
                  <Button onClick={calculateCharges} className="w-full">
                    Calculate Charges
                  </Button>

                  {/* Results */}
                  {result && (
                    <div className="mt-6 space-y-4">
                      {/* Turnover */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Total Turnover</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.turnover)}</p>
                      </div>

                      {/* Breakdown */}
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setShowBreakdown(!showBreakdown)}
                          className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">Detailed Breakdown</span>
                          {showBreakdown ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>

                        {showBreakdown && (
                          <div className="border-t bg-white">
                            <div className="p-4 space-y-2">
                              {[
                                { label: "Brokerage", value: result.brokerage },
                                { label: "Exchange Charges", value: result.exchangeCharges },
                                { label: "SEBI Charges", value: result.sebiCharges },
                                { label: "STT", value: result.stt },
                                { label: "Stamp Duty", value: result.stampDuty },
                                { label: "GST (18%)", value: result.gst },
                              ].map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{item.label}</span>
                                  <span className="font-medium text-gray-900">{formatCurrency(item.value)}</span>
                                </div>
                              ))}
                              <div className="pt-2 mt-2 border-t">
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-900">Total Charges</span>
                                  <span className="font-bold text-primary-600">{formatCurrency(result.totalCharges)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Breakeven */}
                      {result.breakeven > 0 && (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Breakeven Price</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.breakeven)}</p>
                          <p className="text-xs text-gray-500 mt-1">Minimum sell price to cover all charges</p>
                        </div>
                      )}

                      {/* Net Proceeds */}
                      <div className={`p-4 rounded-lg ${result.netPL >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                        <p className="text-sm text-gray-600 mb-1">Net Proceeds</p>
                        <p className={`text-2xl font-bold ${result.netPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.netPL >= 0 ? '+' : ''}{formatCurrency(result.netPL)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {parseFloat(buyPrice || "0") > 0 && parseFloat(sellPrice || "0") > 0
                            ? "After deducting all charges from gross P&L"
                            : parseFloat(sellPrice || "0") > 0
                              ? "Amount you receive after deducting all charges"
                              : "Amount you pay including all charges"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> The calculations provided are indicative and for educational purposes only.
                Actual charges may vary based on specific trade conditions, exchange rules, and regulatory changes.
                Please refer to our official contract notes for exact charges.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
