"use client";

import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  ExternalLink,
  AlertCircle,
  Clock,
  TrendingUp,
  FileText,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function SettlementCalendarPage() {
  // Settlement calendar data for January 2026 (BSE Equity T+1)
  const settlementData = [
    {
      settlementNo: "DR-789/2025-2026",
      depositoryNo: "2526789",
      tradingDate: "01/01/2026",
      entryDate: "01/01/2026",
      confirmationDate: "02/01/2026",
      payInPayOut: "02/01/2026",
      auctionSettlNo: "RA-789/2025-2026",
      submissionDate: "02/01/2026",
      auctionPayOut: "05/01/2026",
    },
    {
      settlementNo: "DR-790/2025-2026",
      depositoryNo: "2526790",
      tradingDate: "02/01/2026",
      entryDate: "02/01/2026",
      confirmationDate: "05/01/2026",
      payInPayOut: "05/01/2026",
      auctionSettlNo: "RA-790/2025-2026",
      submissionDate: "05/01/2026",
      auctionPayOut: "06/01/2026",
    },
    {
      settlementNo: "DR-791/2025-2026",
      depositoryNo: "2526791",
      tradingDate: "05/01/2026",
      entryDate: "05/01/2026",
      confirmationDate: "06/01/2026",
      payInPayOut: "06/01/2026",
      auctionSettlNo: "RA-791/2025-2026",
      submissionDate: "06/01/2026",
      auctionPayOut: "07/01/2026",
    },
    {
      settlementNo: "DR-792/2025-2026",
      depositoryNo: "2526792",
      tradingDate: "06/01/2026",
      entryDate: "06/01/2026",
      confirmationDate: "07/01/2026",
      payInPayOut: "07/01/2026",
      auctionSettlNo: "RA-792/2025-2026",
      submissionDate: "07/01/2026",
      auctionPayOut: "08/01/2026",
    },
    {
      settlementNo: "DR-793/2025-2026",
      depositoryNo: "2526793",
      tradingDate: "07/01/2026",
      entryDate: "07/01/2026",
      confirmationDate: "08/01/2026",
      payInPayOut: "08/01/2026",
      auctionSettlNo: "RA-793/2025-2026",
      submissionDate: "08/01/2026",
      auctionPayOut: "09/01/2026",
    },
    {
      settlementNo: "DR-794/2025-2026",
      depositoryNo: "2526794",
      tradingDate: "08/01/2026",
      entryDate: "08/01/2026",
      confirmationDate: "09/01/2026",
      payInPayOut: "09/01/2026",
      auctionSettlNo: "RA-794/2025-2026",
      submissionDate: "09/01/2026",
      auctionPayOut: "12/01/2026",
    },
    {
      settlementNo: "DR-795/2025-2026",
      depositoryNo: "2526795",
      tradingDate: "09/01/2026",
      entryDate: "09/01/2026",
      confirmationDate: "12/01/2026",
      payInPayOut: "12/01/2026",
      auctionSettlNo: "RA-795/2025-2026",
      submissionDate: "12/01/2026",
      auctionPayOut: "13/01/2026",
    },
    {
      settlementNo: "DR-796/2025-2026",
      depositoryNo: "2526796",
      tradingDate: "12/01/2026",
      entryDate: "12/01/2026",
      confirmationDate: "13/01/2026",
      payInPayOut: "13/01/2026",
      auctionSettlNo: "RA-796/2025-2026",
      submissionDate: "13/01/2026",
      auctionPayOut: "14/01/2026",
    },
    {
      settlementNo: "DR-797/2025-2026",
      depositoryNo: "2526797",
      tradingDate: "13/01/2026",
      entryDate: "13/01/2026",
      confirmationDate: "14/01/2026",
      payInPayOut: "14/01/2026",
      auctionSettlNo: "RA-797/2025-2026",
      submissionDate: "14/01/2026",
      auctionPayOut: "16/01/2026",
    },
    {
      settlementNo: "DR-798/2025-2026",
      depositoryNo: "2526798",
      tradingDate: "14/01/2026",
      entryDate: "14/01/2026",
      confirmationDate: "16/01/2026",
      payInPayOut: "16/01/2026",
      auctionSettlNo: "RA-798/2025-2026",
      submissionDate: "16/01/2026",
      auctionPayOut: "19/01/2026",
    },
    {
      settlementNo: "DR-799/2025-2026",
      depositoryNo: "2526799",
      tradingDate: "15/01/2026",
      entryDate: "15/01/2026",
      confirmationDate: "16/01/2026",
      payInPayOut: "16/01/2026",
      auctionSettlNo: "RA-799/2025-2026",
      submissionDate: "16/01/2026",
      auctionPayOut: "19/01/2026",
    },
    {
      settlementNo: "DR-800/2025-2026",
      depositoryNo: "2526800",
      tradingDate: "16/01/2026",
      entryDate: "16/01/2026",
      confirmationDate: "19/01/2026",
      payInPayOut: "19/01/2026",
      auctionSettlNo: "RA-800/2025-2026",
      submissionDate: "19/01/2026",
      auctionPayOut: "20/01/2026",
    },
    {
      settlementNo: "DR-801/2025-2026",
      depositoryNo: "2526801",
      tradingDate: "19/01/2026",
      entryDate: "19/01/2026",
      confirmationDate: "20/01/2026",
      payInPayOut: "20/01/2026",
      auctionSettlNo: "RA-801/2025-2026",
      submissionDate: "20/01/2026",
      auctionPayOut: "21/01/2026",
    },
    {
      settlementNo: "DR-802/2025-2026",
      depositoryNo: "2526802",
      tradingDate: "20/01/2026",
      entryDate: "20/01/2026",
      confirmationDate: "21/01/2026",
      payInPayOut: "21/01/2026",
      auctionSettlNo: "RA-802/2025-2026",
      submissionDate: "21/01/2026",
      auctionPayOut: "22/01/2026",
    },
    {
      settlementNo: "DR-803/2025-2026",
      depositoryNo: "2526803",
      tradingDate: "21/01/2026",
      entryDate: "21/01/2026",
      confirmationDate: "22/01/2026",
      payInPayOut: "22/01/2026",
      auctionSettlNo: "RA-803/2025-2026",
      submissionDate: "22/01/2026",
      auctionPayOut: "23/01/2026",
    },
    {
      settlementNo: "DR-804/2025-2026",
      depositoryNo: "2526804",
      tradingDate: "22/01/2026",
      entryDate: "22/01/2026",
      confirmationDate: "23/01/2026",
      payInPayOut: "23/01/2026",
      auctionSettlNo: "RA-804/2025-2026",
      submissionDate: "23/01/2026",
      auctionPayOut: "27/01/2026",
    },
    {
      settlementNo: "DR-805/2025-2026",
      depositoryNo: "2526805",
      tradingDate: "23/01/2026",
      entryDate: "23/01/2026",
      confirmationDate: "27/01/2026",
      payInPayOut: "27/01/2026",
      auctionSettlNo: "RA-805/2025-2026",
      submissionDate: "27/01/2026",
      auctionPayOut: "28/01/2026",
    },
    {
      settlementNo: "DR-806/2025-2026",
      depositoryNo: "2526806",
      tradingDate: "27/01/2026",
      entryDate: "27/01/2026",
      confirmationDate: "28/01/2026",
      payInPayOut: "28/01/2026",
      auctionSettlNo: "RA-806/2025-2026",
      submissionDate: "28/01/2026",
      auctionPayOut: "29/01/2026",
    },
    {
      settlementNo: "DR-807/2025-2026",
      depositoryNo: "2526807",
      tradingDate: "28/01/2026",
      entryDate: "28/01/2026",
      confirmationDate: "29/01/2026",
      payInPayOut: "29/01/2026",
      auctionSettlNo: "RA-807/2025-2026",
      submissionDate: "29/01/2026",
      auctionPayOut: "30/01/2026",
    },
    {
      settlementNo: "DR-808/2025-2026",
      depositoryNo: "2526808",
      tradingDate: "29/01/2026",
      entryDate: "29/01/2026",
      confirmationDate: "30/01/2026",
      payInPayOut: "30/01/2026",
      auctionSettlNo: "RA-808/2025-2026",
      submissionDate: "30/01/2026",
      auctionPayOut: "02/02/2026",
    },
    {
      settlementNo: "DR-809/2025-2026",
      depositoryNo: "2526809",
      tradingDate: "30/01/2026",
      entryDate: "30/01/2026",
      confirmationDate: "02/02/2026",
      payInPayOut: "02/02/2026",
      auctionSettlNo: "RA-809/2025-2026",
      submissionDate: "02/02/2026",
      auctionPayOut: "03/02/2026",
    },
  ];

  const settlementProcess = [
    {
      title: "T Day",
      description: "Trading Day - When you buy or sell securities",
      icon: TrendingUp,
      color: "blue",
    },
    {
      title: "T+1 Day (Pay-In)",
      description: "Payment/Securities delivery to exchange by your broker",
      icon: FileText,
      color: "orange",
    },
    {
      title: "T+2 Day (Pay-Out)",
      description: "You receive securities/funds in your account",
      icon: CheckCircle2,
      color: "green",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              Settlement Information
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Settlement Calendar
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Track settlement cycles and pay-in/pay-out dates for equity trading
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild className="bg-white text-primary-600 hover:bg-gray-100 border-0 text-lg px-8">
                <a href="https://www.bseindia.com/markets/equity/EQReports/setcal.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  View BSE Settlement Calendar
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* T+1 Settlement Explanation */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Understanding T+1 Settlement Cycle
              </h2>
              <p className="text-lg text-gray-600">
                Indian stock markets follow a T+1 rolling settlement system
              </p>
            </div>

            <Card className="border-2 border-primary-100 mb-8">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      What is T+1 Settlement?
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      T+1 settlement means that if you buy or sell shares on a trading day (T), the settlement
                      of those trades happens on the next trading day (T+1). This is a rolling settlement system
                      where each trading day is settled independently.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      The settlement process involves the exchange of money and securities between buyers and sellers.
                      Indian stock exchanges (BSE and NSE) moved from T+2 to T+1 settlement cycle in January 2023
                      to improve efficiency and reduce settlement risk.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              {settlementProcess.map((step, index) => (
                <Card key={index} className="border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 bg-${step.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                        <step.icon className={`h-8 w-8 text-${step.color}-600`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Settlement Calendar Table */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Settlement Schedule - January 2026</h2>
              <p className="text-lg text-gray-600">Equity T + 1 Settlement Calendar (BSE)</p>
            </div>

            <Card className="border-2 border-gray-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-primary-600 text-white">
                      <tr>
                        <th className="px-3 py-3 text-left font-bold text-xs">Settlement No.</th>
                        <th className="px-3 py-3 text-left font-bold text-xs">Settl.No.for Depository purpose</th>
                        <th className="px-3 py-3 text-left font-bold text-xs">Trading Date</th>
                        <th className="px-3 py-3 text-left font-bold text-xs">Entry of 6A/7A data by members</th>
                        <th className="px-3 py-3 text-left font-bold text-xs">Confirmation of 6A/7A Data by custodians & FI & issue of delivery money statements etc</th>
                        <th className="px-3 py-3 text-left font-bold text-xs">Pay-In/ Pay-out +</th>
                        <th className="px-3 py-3 text-left font-bold text-xs">Auction Settl. No. +++</th>
                        <th className="px-3 py-3 text-left font-bold text-xs">Submission of auction/option for delivery</th>
                        <th className="px-3 py-3 text-left font-bold text-xs">Auction/Pay-in/ Pay-out ++</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {settlementData.map((settlement, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-3 py-3 text-gray-900 font-medium whitespace-nowrap">{settlement.settlementNo}</td>
                          <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{settlement.depositoryNo}</td>
                          <td className="px-3 py-3 text-gray-900 font-medium whitespace-nowrap">{settlement.tradingDate}</td>
                          <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{settlement.entryDate}</td>
                          <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{settlement.confirmationDate}</td>
                          <td className="px-3 py-3 text-gray-900 font-medium whitespace-nowrap">{settlement.payInPayOut}</td>
                          <td className="px-3 py-3 text-gray-900 font-medium whitespace-nowrap">{settlement.auctionSettlNo}</td>
                          <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{settlement.submissionDate}</td>
                          <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{settlement.auctionPayOut}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-yellow-50 mt-8">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Settlement Timings & Important Notes:</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="border-l-4 border-primary-600 pl-4">
                    <p className="font-semibold mb-2">Example Settlement Timings (DR-798/2025-2026, Trade Date: 14/01/2026):</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Pay-in: 10:30 a.m. | Pay-out: 12:30 p.m.</li>
                      <li>• Members to submit pay-in instructions to Depositories/banks latest by: 10:20 a.m.</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-primary-600 pl-4">
                    <p className="font-semibold mb-2">Example Settlement Timings (DR-799/2025-2026, Trade Date: 15/01/2026):</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Pay-in: 04:30 p.m. | Pay-out: 09:30 p.m.</li>
                      <li>• Members to submit pay-in instructions to Depositories/banks latest by: 4:20 p.m.</li>
                    </ul>
                  </div>
                  <p><strong>+ Pay-in at 10:30 a.m.</strong> Members to submit pay-in instructions to Depositories/banks latest by 10:30 a.m. Pay-out of funds and securities will be effected by 1:30 p.m.</p>
                  <p><strong>++ Auction pay-in at 8:00 a.m.</strong> Members to submit pay-in instructions to Depositories/banks latest by 7:50 a.m.</p>
                  <p><strong>+++ All Shortages in Trade to Trade segment (securities settled on Gross level)</strong> and all shortages for scrips in which No-delivery period has been abolished will be directly closed out as mentioned in the Notice No.20190529-43 dated May 29, 2019.</p>
                  <p className="text-xs italic">OTB allocation (Give-up entry) can be done by members upto 08:00 p.m. on T day and OTB confirmation (Take-up entry) can be done by custodians upto 07:30 a.m. on T+1 day (Please refer Notice No.20221223-17)</p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                For complete settlement calendar, please visit the official exchange websites
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Key Points */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Settlement Points</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-primary-600">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">For Buyers</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>Funds are debited from your trading account on T day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>Shares are credited to your demat account by T+1 day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>You can sell the shares from T+1 day onwards</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary-600">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">For Sellers</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>Shares are debited from your demat account on T+1 day (Pay-In)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>Sale proceeds are credited to your account on T+2 day (Pay-Out)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>Ensure sufficient shares are available in demat before selling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary-600">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Pay-In Day</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>Brokers pay funds/deliver securities to the exchange</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>Securities pay-in happens on T+1 day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>Funds pay-in also happens on T+1 day</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-primary-600">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Pay-Out Day</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>Exchange pays out funds/securities to brokers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>Securities pay-out happens on T+1 day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>Funds pay-out happens on T+2 day</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Important Notes */}
      <section className="py-16 bg-yellow-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notes</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      Indian equity markets follow a T+1 settlement cycle, which means trades are settled one business day after the trade date.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      Holidays are not counted in the settlement cycle. If T+1 falls on a holiday, settlement happens on the next trading day.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      Both BSE and NSE follow the same settlement cycle for equity cash segment trades.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      Derivative contracts (Futures & Options) follow different settlement mechanisms. F&O contracts are settled on expiry dates.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      For auction settlements and other special cases, different timelines may apply. Check with your broker for specific details.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      The settlement calendar is subject to change based on exchange notifications. Always verify with official exchange communications.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Resources */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Resources</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Trading Holidays</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    View the complete list of stock exchange holidays for the year
                  </p>
                  <Button variant="outline" asChild className="border-primary-600 text-primary-600">
                    <Link href="/resources/holidays">View Holidays</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Market Timings</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Learn about trading hours for different market segments
                  </p>
                  <Button variant="outline" asChild className="border-primary-600 text-primary-600">
                    <Link href="/resources/holidays#trading-hours">View Timings</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need More Information?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Visit the official BSE website for the latest settlement schedules
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild className="bg-white text-primary-600 hover:bg-gray-100 border-0">
                <a href="https://www.bseindia.com/markets/equity/EQReports/setcal.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  BSE Settlement Calendar
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-600 text-center">
              <strong>Disclaimer:</strong> The settlement calendar is indicative and subject to change based on exchange notifications.
              Please refer to the official BSE website for the most up-to-date settlement schedules.
              Sunidhi Securities is not responsible for any changes made by the exchange after publication.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
