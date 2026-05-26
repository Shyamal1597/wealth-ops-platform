import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  BarChart2,
  Headphones,
  Smartphone,
  Megaphone,
  Briefcase,
  CheckCircle,
  ArrowRight,
  IndianRupee,
  Zap,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Become a Sub Broker | Sunidhi Securities & Finance Limited",
  description:
    "Partner with Sunidhi Securities and build your own financial business. Earn up to 70% revenue share, get full business support, and grow with one of India's trusted broking houses.",
};

export default function SubBrokersPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-black text-white py-20">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block bg-primary-600 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
              Partnership Programme
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              Become a Sub Broker &amp; Build Your Own{" "}
              <span className="text-primary-400">Financial Business</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
              Turn your network into income. Join one of India&apos;s trusted
              broking houses and earn high recurring revenue by helping clients
              invest and trade — with{" "}
              <span className="text-white font-semibold">zero investment</span>{" "}
              to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/support/contact">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Become a Sub Broker Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/support/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  Contact Us Now
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Key Stats Bar ─────────────────────────────────────── */}
      <section className="bg-primary-600 text-white py-6">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "Up to 70%", label: "Revenue Share" },
              { value: "Zero", label: "Investment to Start" },
              { value: "24x7", label: "Back Office Access" },
              { value: "69+", label: "Years of Trust" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-primary-100 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Revenue Sharing ───────────────────────────────────── */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Earn More with Attractive Revenue Sharing
              </h2>
              <p className="text-gray-600 mb-6">
                Our sub-broker programme is designed to reward your effort with
                one of the most competitive payout structures in the industry.
              </p>
              <ul className="space-y-3">
                {[
                  "Up to 70% revenue share",
                  "Consistent monthly income",
                  "Unlimited earning potential",
                  "Intraday, Delivery, F&O, Commodity & Currency earnings",
                  "Fast & transparent payouts",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <IndianRupee className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Business. Your Income.
              </h3>
              <p className="text-gray-600">
                Stop working for others. Start building your own financial
                business with strong backend support, a trusted brand behind
                you, and high earnings from day one.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Why Partner With Us ───────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Partner With Sunidhi Securities?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We don&apos;t just onboard you — we help you grow every step of
              the way.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPartner.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <item.icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </div>
                <ul className="space-y-2">
                  {item.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Product Basket ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Offer a Complete Financial Product Basket
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Give your clients access to a full suite of investment and trading
              products — all under one roof.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((p) => (
              <div
                key={p}
                className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium text-gray-700"
              >
                {p}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Who Can Join + Process ────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Who can join */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Who Can Join?
                </h2>
              </div>
              <ul className="space-y-3">
                {[
                  "Individuals / Sub Brokers / Agents",
                  "Existing financial advisors",
                  "Anyone with a good network & ambition",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Simple process */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Zap className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Simple Registration Process
                </h2>
              </div>
              <div className="space-y-4">
                {[
                  { step: "01", text: "Submit minimal documentation" },
                  { step: "02", text: "Quick activation by our team" },
                  { step: "03", text: "Full onboarding support provided" },
                  { step: "04", text: "Start earning from day one" },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center">
                      {s.step}
                    </span>
                    <span className="text-gray-700">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Extra Benefits ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Extra Benefits That Give You an Edge
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BarChart2, text: "Trade for multiple clients" },
              { icon: TrendingUp, text: "Real-time reports & analytics" },
              { icon: ShieldCheck, text: "Margin Trading Facility (MTF) available" },
              { icon: Users, text: "Strong brand trust & nationwide presence" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-start gap-3 p-5 bg-gray-50 rounded-xl border border-gray-100"
              >
                <item.icon className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-16 bg-black text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Business. Your Income.{" "}
              <span className="text-primary-400">Your Growth.</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Start your journey with Sunidhi Securities &amp; Finance Limited
              and build a thriving financial business with one of India&apos;s
              most trusted broking partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support/contact">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Contact Us Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/open-account">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  Open an Account
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

// ── Data ─────────────────────────────────────────────────────

const whyPartner = [
  {
    icon: Zap,
    title: "Zero Investment to Start",
    points: ["No security deposit required", "Free account opening support"],
  },
  {
    icon: Smartphone,
    title: "Powerful Trading Platforms",
    points: [
      "Mobile Trading App — Easy, Fast & Smart",
      "Advanced Desktop Software",
      "Multi-asset trading in one platform",
      "Option strategy builder & live charts",
    ],
  },
  {
    icon: Headphones,
    title: "Complete Business Support",
    points: [
      "Dedicated Relationship Manager",
      "24x7 Back Office Access",
      "Client reports: P&L, Ledger, Holdings",
      "Smooth operations & support",
    ],
  },
  {
    icon: BarChart2,
    title: "Research & Advisory Support",
    points: [
      "Daily market calls",
      "Technical & fundamental research",
      "Trading ideas for better client engagement",
    ],
  },
  {
    icon: Megaphone,
    title: "Marketing & Lead Support",
    points: [
      "Social media branding support",
      "Investor awareness programmes",
      "Free marketing materials (banners, visiting cards)",
      "Leads shared in your area",
    ],
  },
  {
    icon: Briefcase,
    title: "Strong Brand & Compliance",
    points: [
      "69+ years of market trust",
      "SEBI registered, NSE & BSE member",
      "100+ locations across India",
      "50,000+ happy clients",
    ],
  },
];

const products = [
  "Equity & Derivatives",
  "Commodities",
  "Currency",
  "IPO",
  "Mutual Funds",
  "Demat & Trading",
];
