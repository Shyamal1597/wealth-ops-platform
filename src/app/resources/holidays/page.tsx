"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  ExternalLink,
  AlertCircle,
  Clock,
  Building2,
  Filter,
  Info,
} from "lucide-react";
import Link from "next/link";

// Type definitions
type Segment = "equity" | "fo" | "currency" | "commodity";

interface Holiday {
  date: string;
  day: string;
  occasion: string;
  segments: Segment[];
  isWeekend: boolean;
}

// Enhanced holiday data with segment information and weekend flags
// Source: NSE Official Holiday Calendar 2026
const holidays2026: Holiday[] = [
  {
    date: "January 26, 2026",
    day: "Monday",
    occasion: "Republic Day",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "February 15, 2026",
    day: "Sunday",
    occasion: "Mahashivratri",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: true
  },
  {
    date: "March 3, 2026",
    day: "Tuesday",
    occasion: "Holi",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "March 21, 2026",
    day: "Saturday",
    occasion: "Id-Ul-Fitr (Ramadan Eid)",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: true
  },
  {
    date: "March 26, 2026",
    day: "Thursday",
    occasion: "Shri Ram Navami",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "March 31, 2026",
    day: "Tuesday",
    occasion: "Shri Mahavir Jayanti",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "April 3, 2026",
    day: "Friday",
    occasion: "Good Friday",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "April 14, 2026",
    day: "Tuesday",
    occasion: "Dr. Baba Saheb Ambedkar Jayanti",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "May 1, 2026",
    day: "Friday",
    occasion: "Maharashtra Day",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "May 28, 2026",
    day: "Thursday",
    occasion: "Bakri Id",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "June 26, 2026",
    day: "Friday",
    occasion: "Muharram",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "August 15, 2026",
    day: "Saturday",
    occasion: "Independence Day",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: true
  },
  {
    date: "September 14, 2026",
    day: "Monday",
    occasion: "Ganesh Chaturthi",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "October 2, 2026",
    day: "Friday",
    occasion: "Mahatma Gandhi Jayanti",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "October 20, 2026",
    day: "Tuesday",
    occasion: "Dussehra",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "November 8, 2026",
    day: "Sunday",
    occasion: "Diwali Laxmi Pujan*",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: true
  },
  {
    date: "November 10, 2026",
    day: "Tuesday",
    occasion: "Diwali-Balipratipada",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "November 24, 2026",
    day: "Tuesday",
    occasion: "Prakash Gurpurb Sri Guru Nanak Dev",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
  {
    date: "December 25, 2026",
    day: "Friday",
    occasion: "Christmas",
    segments: ["equity", "fo", "currency", "commodity"],
    isWeekend: false
  },
];

const specialTradingHours = [
  {
    date: "November 8, 2026",
    occasion: "Diwali Laxmi Pujan (Muhurat Trading)",
    timings: "Evening Session Only",
    note: "November 08, 2026, shall be a trading holiday on account of Diwali Laxmi Pujan. Muhurat Trading will be conducted on that day. Timings of Muhurat Trading shall be notified subsequently through a circular.",
  },
];

export default function HolidaysPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedSegment, setSelectedSegment] = useState<"all" | Segment>("all");



  // Filter holidays based on selected segment
  const filteredHolidays = useMemo(() => {
    if (selectedSegment === "all") {
      return holidays2026;
    }
    return holidays2026.filter(holiday =>
      holiday.segments.includes(selectedSegment)
    );
  }, [selectedSegment]);

  // Separate holidays into working days and weekends
  const workingDayHolidays = useMemo(() =>
    filteredHolidays.filter(h => !h.isWeekend),
    [filteredHolidays]
  );

  const weekendHolidays = useMemo(() =>
    filteredHolidays.filter(h => h.isWeekend),
    [filteredHolidays]
  );

  const segmentOptions = [
    { value: "all", label: "All Segments" },
    { value: "equity", label: "Equity Segment" },
    { value: "fo", label: "Futures & Options (F&O)" },
    { value: "currency", label: "Currency Derivatives" },
    { value: "commodity", label: "Commodity Derivatives" },
  ];

  const getSegmentLabel = (segment: Segment) => {
    const labels: Record<Segment, string> = {
      equity: "Cash",
      fo: "F&O",
      currency: "FX",
      commodity: "Commodities"
    };
    return labels[segment];
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              Trading Calendar
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              NSE Stock Exchange{" "}
              <span className="text-white/90">Holidays</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Plan your trading activities with the complete list of stock exchange holidays
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild className="bg-white text-primary-600 hover:bg-gray-100 border-0 text-lg px-8">
                <a href="https://www.nseindia.com/resources/exchange-communication-holidays" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  View Official NSE Calendar
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Trading Holidays {selectedYear}</h2>
              <p className="text-gray-600">Filter by segment to view relevant holidays</p>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <select
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value as "all" | Segment)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {segmentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant={selectedYear === "2026" ? "default" : "outline"}
                onClick={() => setSelectedYear("2026")}
              >
                2026
              </Button>
              <Button variant="outline" asChild>
                <a href="https://www.nseindia.com/resources/exchange-communication-holidays" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Info Cards */}
      <section className="py-8 bg-gray-50">
        <Container>
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-900">{workingDayHolidays.length}</p>
                    <p className="text-sm text-green-700">Working Day Holidays</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{weekendHolidays.length}</p>
                    <p className="text-sm text-blue-700">Weekend Holidays</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary-200 bg-primary-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-900">{filteredHolidays.length}</p>
                    <p className="text-sm text-primary-700">Total Holidays</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Working Day Holidays */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Working Day Holidays</h2>
              </div>
              <p className="text-gray-600 ml-13">Holidays that fall on weekdays (Monday-Friday) - Markets will be closed</p>
            </div>

            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="px-4 py-2 text-left text-sm font-semibold border border-slate-600 whitespace-nowrap">Sr.No.</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold border border-slate-600">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold border border-slate-600">Day</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold border border-slate-600">Occasion</th>
                    {selectedSegment === "all" && (
                      <th className="px-4 py-2 text-left text-sm font-semibold border border-slate-600">Segments</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {workingDayHolidays.length > 0 ? (
                    workingDayHolidays.map((holiday, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300">{index + 1}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300 whitespace-nowrap">{holiday.date}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300">{holiday.day}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">{holiday.occasion}</td>
                        {selectedSegment === "all" && (
                          <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300 whitespace-nowrap">
                            {holiday.segments.map(seg => getSegmentLabel(seg)).join(" | ")}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={selectedSegment === "all" ? 5 : 4} className="px-4 py-6 text-center text-gray-500 border border-gray-300">
                        No working day holidays for selected segment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* Weekend Holidays */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Weekend Holidays</h2>
              </div>
              <p className="text-gray-600 ml-13">Holidays that fall on weekends (Saturday-Sunday) - Markets already closed</p>
            </div>

            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="px-4 py-2 text-left text-sm font-semibold border border-slate-600 whitespace-nowrap">Sr.No.</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold border border-slate-600">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold border border-slate-600">Day</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold border border-slate-600">Occasion</th>
                    {selectedSegment === "all" && (
                      <th className="px-4 py-2 text-left text-sm font-semibold border border-slate-600">Segments</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {weekendHolidays.length > 0 ? (
                    weekendHolidays.map((holiday, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300">{index + 1}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300 whitespace-nowrap">{holiday.date}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300">{holiday.day}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">{holiday.occasion}</td>
                        {selectedSegment === "all" && (
                          <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300 whitespace-nowrap">
                            {holiday.segments.map(seg => getSegmentLabel(seg)).join(" | ")}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={selectedSegment === "all" ? 5 : 4} className="px-4 py-6 text-center text-gray-500 border border-gray-300">
                        No weekend holidays for selected segment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">About Weekend Holidays</h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      These holidays fall on Saturdays or Sundays when markets are already closed for regular weekend trading.
                      While they are official holidays, they have minimal impact on trading schedules. However, they may affect
                      settlement cycles and other back-office operations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Special Trading Hours */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Special Trading Hours</h2>
              <p className="text-lg text-gray-600">Muhurat Trading and other special sessions</p>
            </div>

            <div className="space-y-4">
              {specialTradingHours.map((session, index) => (
                <Card key={index} className="border-l-4 border-primary-600">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{session.occasion}</h3>
                          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full w-fit">
                            {session.date}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">
                          <strong>Trading Hours:</strong> {session.timings}
                        </p>
                        <p className="text-gray-600 text-sm">{session.note}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                      <strong>Working Day Holidays</strong> fall on weekdays (Monday-Friday) and result in market closures with direct trading impact.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      <strong>Weekend Holidays</strong> fall on Saturdays or Sundays when markets are already closed, having minimal trading impact.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      The above holidays are applicable for NSE Equity, Futures & Options, Currency Derivatives, and Commodity Derivatives segments.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      For the calendar year 2026, all trading holidays are common across Equity, F&O, Currency, and Commodity segments. The segment filter is provided for reference and future updates.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      November 08, 2026 (Saturday) will be a trading holiday for Diwali Laxmi Pujan. Muhurat Trading will be conducted on that day.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      Trading holidays are subject to change as per notifications from NSE and SEBI. Please verify with official NSE communications.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      In case of any changes in holidays, NSE will issue a separate circular which will be available on the NSE website.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      Muhurat Trading session timings will be announced separately by NSE closer to the Diwali festival.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>
                      For BSE holidays and other exchange-specific information, please refer to the respective exchange websites.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Market Timings Reference */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Market Timings</h2>
              <p className="text-lg text-gray-600">Trading on the equities segment takes place on all days of the week (except Saturdays and Sundays and holidays declared by the Exchange in advance)</p>
            </div>

            <div className="space-y-6">
              {/* Equity Segment Detailed Timings */}
              <Card className="border-2 border-primary-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Equity Segment - Detailed Market Timings</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-bold text-gray-900 mb-2">A) Pre-open session</h4>
                      <div className="space-y-1 text-gray-700 text-sm">
                        <p><strong>Order entry & modification Open:</strong> 09:00 hrs</p>
                        <p><strong>Order entry & modification Close:</strong> 09:08 hrs*</p>
                        <p className="text-xs italic text-gray-600">*with random closure in last one minute. Pre-open order matching starts immediately after close of pre-open order entry.</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-bold text-gray-900 mb-2">B) Regular trading session</h4>
                      <div className="space-y-1 text-gray-700 text-sm">
                        <p><strong>Normal / Limited Physical Market Open:</strong> 09:15 hrs</p>
                        <p><strong>Normal / Limited Physical Market Close:</strong> 15:30 hrs</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-bold text-gray-900 mb-2">C) Closing session</h4>
                      <div className="space-y-1 text-gray-700 text-sm">
                        <p>The Closing session is held between <strong>15:40 hrs</strong> and <strong>16:00 hrs</strong></p>
                      </div>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-bold text-gray-900 mb-2">D) Block Deal session Timings</h4>
                      <div className="space-y-1 text-gray-700 text-sm">
                        <p><strong>Morning Window:</strong> This window shall operate between <strong>08:45 AM</strong> to <strong>09:00 AM</strong></p>
                        <p><strong>Afternoon Window:</strong> This window shall operate between <strong>02:05 PM</strong> to <strong>2:20 PM</strong></p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Other Segments */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">F&O Segment</h3>
                    </div>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Normal Trading:</strong> 9:15 AM - 3:30 PM</p>
                      <p><strong>Closing Session:</strong> 3:30 PM - 4:00 PM</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Currency Segment</h3>
                    </div>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Normal Trading:</strong> 9:00 AM - 5:00 PM</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Commodity Segment</h3>
                    </div>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Normal Trading:</strong> 9:00 AM - 11:30 PM</p>
                      <p className="text-sm text-gray-600">(May vary by commodity)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
              Visit the official NSE website for the latest updates and notifications
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild className="bg-white text-primary-600 hover:bg-gray-100 border-0">
                <a href="https://www.nseindia.com/resources/exchange-communication-holidays" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Official NSE Holiday Calendar
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                <Link href="/support/contact">Contact Us</Link>
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
              <strong>Disclaimer:</strong> The holiday list is subject to change. Please refer to the official NSE website
              for the most up-to-date information. Sunidhi Securities is not responsible for any changes made by the exchange
              after publication.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
