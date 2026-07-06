"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Shield,
  Users,
  Award,
  ChevronRight,
  Star,
  Building2,
  Briefcase,
  PieChart,
  Smartphone,
  BarChart3,
  Bell,
  Zap,
  ChevronLeft,
  Quote,
  CheckCircle2,
  UserCheck,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentAppFeature, setCurrentAppFeature] = useState(0);
  const [isIOS, setIsIOS] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Calculate years since inception (founded in 1957)
  const FOUNDING_YEAR = 1957;
  const currentYear = new Date().getFullYear();
  const yearsOfExcellence = currentYear - FOUNDING_YEAR;

  const testimonials = [
    {
      name: "Sumeer Kumar",
      company: "S N Shares & Stockbrokers Pvt Ltd",
      duration: "28 Years",
      text: "Rare to find a professional alliance that spans 28 years. Our association with Sunidhi Securities has made it feel seamless and flawless. The adjectives which sum up the DNA of Sunidhi Securities is TRUST, SERVICE and FLEXIBILITY.",
      rating: 5,
      image: "/images/testimonials/sumeer-kumar.jpg",
    },
    {
      name: "Jigar Vaid",
      company: "Long-term Client",
      duration: "20+ Years",
      text: "We have been associated with Sunidhi Securities & Finance Ltd for more than 20 years. Their DP services are prompt and reliable, supported by a dedicated and responsive Relationship Manager. The advanced technology platform ensures seamless and transparent transactions.",
      rating: 5,
      image: "/images/testimonials/jigar-vaid.jpg",
    },
    {
      name: "Nishit Voraa",
      company: "Eastern Commercial Corporation",
      duration: "25 Years",
      text: "I am proud to have partnered with Sunidhi Securities and Finance Limited for the last 25 years. Their professionalism, expertise, and commitment to excellence have made our association truly rewarding. I've witnessed significant growth and innovation under their leadership.",
      rating: 5,
      image: "/images/testimonials/nishit-voraa.jpg",
    },
    {
      name: "Elyas H Lucknowala",
      company: "Associate Partner",
      duration: "",
      text: "SUNIDHI has been a game-changer for my investment journey. Their platform is intuitive and easy to navigate, and their market analysis has proven to be incredibly helpful in making informed decisions. The support team is prompt and professional.",
      rating: 5,
      image: "/images/testimonials/elyas-lucknowala.jpg",
    },
    {
      name: "Satyajit R. Shah",
      company: "Satyajit Investments",
      duration: "15+ Years",
      text: "Working with Sunidhi Securities & Finance Ltd. for over 15 years has been a rewarding journey. Their strong systems, ethical practices, and unwavering support have enabled me to serve clients with confidence and efficiency.",
      rating: 5,
      image: "/images/testimonials/satyajit-shah.jpg",
    },
    {
      name: "Jaydip K Mehta",
      company: "Channel Partner, Kolkata",
      duration: "25 Years",
      text: "I have been with Sunidhi for the last 25 years as their channel partner in Kolkata. The transparency and integrity is what builds trust in such business relationships.",
      rating: 5,
      image: "/images/testimonials/jaydip-mehta.jpg",
    },
    {
      name: "Shubham Chaudhary",
      company: "Sub-Broker (AP)",
      duration: "Since Nov 2020",
      text: "It has been a pleasure working with Sunidhi. I appreciate their professional support and reliable services.",
      rating: 5,
      image: "/images/testimonials/shubham-chaudhary.jpg",
    },
    {
      name: "Kailash Kumar Tekriwal",
      company: "Sub-Broker",
      duration: "Since 2022",
      text: "Their guidance, transparency, and professional approach make investing simple and reliable for both partners and clients.",
      rating: 5,
      image: "/images/testimonials/kailash-tekriwal.jpg",
    },
  ];

  const appFeatures = [
    {
      title: "Custom Watchlist",
      description: "Track your favorite stocks in real-time with instant price updates and market movements",
      icon: BarChart3,
      screenshot: "/images/app/App_Sc1.webp",
    },
    {
      title: "Stock Details & Analysis",
      description: "Comprehensive stock information including DPR, market depth, volume analysis, and technical indicators",
      icon: TrendingUp,
      screenshot: "/images/app/App_Sc2.webp",
    },
    {
      title: "Advanced Option Chain",
      description: "Access detailed option chain data with calls, puts, OI, IV, and strike price analysis for informed trading",
      icon: PieChart,
      screenshot: "/images/app/App_Sc3.webp",
    },
    {
      title: "Market Depth View",
      description: "Real-time bid-ask spread, order book depth, and one-tap Buy/Sell execution for quick trading decisions",
      icon: Zap,
      screenshot: "/images/app/App_Sc4.webp",
    },
    {
      title: "Technical Indicator",
      description: "Clear trading signals powered by real-time Technical Indicators",
      icon: Bell,
      screenshot: "/images/app/App_Sc5.webp",
    },
  ];

  const statistics = [
    { value: `${yearsOfExcellence}+`, label: "Years of Market Experience", icon: Award },
    { value: "50,000+", label: "Clients Trust Us", icon: Users },
    { value: "350+", label: "Family Offices", icon: Landmark },
    { value: "70+", label: "Cities Across India", icon: Building2 },
    { value: "200+", label: "Corporate Relationships", icon: Briefcase },
    { value: "130+", label: "Institutional Empanelments", icon: Shield },
  ];

  const services = [
    {
      title: "Stock Market Trading",
      description: "Open trading account for seamless stock market and trading across NSE and BSE with best trading app in India",
      icon: TrendingUp,
      link: "/expertise/retail-equity",
    },
    {
      title: "Intraday Trading & F&O",
      description: "Access intraday trading, futures and options in capital market with comprehensive analysis",
      icon: BarChart3,
      link: "/expertise/commodities-trading",
    },
    {
      title: "Commodity Trading",
      description: "Trade in commodity market with our advanced commodities trading platform for spot and futures",
      icon: PieChart,
      link: "/expertise/commodities-trading",
    },
    {
      title: "Forex & Currency Derivatives",
      description: "Currency derivatives trading with competitive spreads through our derivatives desk",
      icon: Shield,
      link: "/expertise/commodities-trading",
    },
    {
      title: "IPO Investments",
      description: "Get access to latest IPOs and public offerings in capital market with expert guidance",
      icon: Briefcase,
      link: "/services/ipo",
    },
    {
      title: "Portfolio Management",
      description: "Professional wealth management services tailored to your financial goals",
      icon: Award,
      link: "/expertise/mutual-fund-distribution",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAppFeature((prev) => (prev + 1) % appFeatures.length);
    }, 4000); // Auto-rotate app screenshots every 4 seconds
    return () => clearInterval(interval);
  }, [appFeatures.length]);

  useEffect(() => {
    // Detect if user is on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iOS);

    // Set QR code URL based on device
    const appUrl = iOS
      ? "https://apps.apple.com/in/app/sunidhi-online/id1553728281"
      : "https://play.google.com/store/apps/details?id=com.saral_info.moneymaker.sunidhi&hl=en-IN";

    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appUrl)}`);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <>
      {/* Hero Section - Black Banner */}
      <section className="relative bg-black text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
        <Container className="relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <Award className="h-4 w-4 text-red-500" />
              <span>{yearsOfExcellence}+ YEARS OF EXCELLENCE IN FINANCIAL SERVICES</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              In Your Prosperity
              <br />
              <span className="text-red-500">Lies Our Success</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the best trading app in India for stock market trading, intraday trading, commodity market, and forex trading. Navigate the capital market with confidence using our advanced commodities trading platform. Expert guidance and trusted partnerships for over {yearsOfExcellence} years.
            </p>

            {/* Statistics Grid - Compact with 6 items */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-10 justify-items-center">
              {statistics.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 w-full text-center">
                  <stat.icon className="h-6 w-6 text-red-500 mb-2 mx-auto" />
                  <div className="text-xl md:text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs text-white/80 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Services Overview - Reduced Height */}
      <section className="py-12 bg-white">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
              Complete Stock Market Trading & Investment Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Open trading account for stock market trading, intraday trading, commodity market, forex trading in India - all on the best trading app in India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <Link key={index} href={service.link}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary-500 group">
                  <CardContent className="p-5">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                      <service.icon className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{service.description}</p>
                    <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      Learn More <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Mobile App Showcase with QR Code */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <Container>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full text-primary-700 font-semibold mb-4">
              <Smartphone className="h-5 w-5" />
              <span>DOWNLOAD OUR MOBILE APP</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
              Best Trading App in India - Trade Anywhere, Anytime
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience stock market trading, intraday trading, commodity market, and forex trading in India with the best trading app in India
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            {/* App Screenshots Carousel */}
            <div className="relative">
              <div className="relative aspect-[9/19] max-w-sm mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 rounded-[3rem] transform rotate-3 opacity-10"></div>
                <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden relative">
                    <Image
                      src={appFeatures[currentAppFeature].screenshot}
                      alt={appFeatures[currentAppFeature].title}
                      width={375}
                      height={812}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="App features gallery">
                {appFeatures.map((_, index) => (
                  <button
                    key={index}
                    role="tab"
                    aria-selected={currentAppFeature === index}
                    aria-label={`View feature ${index + 1}`}
                    onClick={() => setCurrentAppFeature(index)}
                    className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${currentAppFeature === index
                      ? "bg-primary-600 w-8"
                      : "bg-gray-300 w-2 hover:bg-gray-400"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* App Features List with QR Code */}
            <div className="space-y-4">
              {appFeatures.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAppFeature(index)}
                  aria-expanded={currentAppFeature === index}
                  className={`w-full text-left p-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${currentAppFeature === index
                    ? "bg-primary-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-900 hover:shadow-md hover:scale-102"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${currentAppFeature === index
                        ? "bg-white/20"
                        : "bg-primary-100"
                        }`}
                    >
                      <feature.icon
                        className={`h-6 w-6 ${currentAppFeature === index
                          ? "text-white"
                          : "text-primary-600"
                          }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                      <p
                        className={`text-sm ${currentAppFeature === index
                          ? "text-white/90"
                          : "text-gray-600"
                          }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                    {currentAppFeature === index && (
                      <CheckCircle2 className="h-5 w-5 text-white flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}

              {/* QR Code and Download Section */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* QR Code - Dynamic based on device */}
                  <div className="bg-white p-4 rounded-lg border-2 border-primary-200 text-center">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Scan to Download</p>
                    <div className="inline-block p-3 bg-white rounded-lg">
                      {qrCodeUrl && (
                        <Image
                          src={qrCodeUrl}
                          alt={`Download App for ${isIOS ? 'iOS' : 'Android'}`}
                          width={150}
                          height={150}
                          className="w-32 h-32"
                          unoptimized
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {isIOS ? 'Download from App Store' : 'Download from Play Store'}
                    </p>
                  </div>

                  {/* Download Buttons */}
                  <div className="flex flex-col justify-center gap-3">
                    <p className="text-sm text-gray-600 font-medium">Or download directly:</p>
                    <Button asChild className="bg-black hover:bg-gray-800 text-white">
                      <Link href="https://play.google.com/store/apps/details?id=com.saral_info.moneymaker.sunidhi&hl=en-IN" target="_blank">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                        </svg>
                        Google Play
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-2 border-gray-300 hover:bg-gray-50">
                      <Link href="https://apps.apple.com/in/app/sunidhi-online/id1553728281" target="_blank">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                        </svg>
                        App Store
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Client Testimonials */}
      <section className="py-12 bg-white">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
              Trusted by Thousands of Investors
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from our clients about their experience with Sunidhi Securities
            </p>
          </div>

          <div className="max-w-5xl mx-auto relative">
            <Card className="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 shadow-xl">
              <CardContent className="p-8 md:p-12">
                {/* Client Image and Info Row */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                  {/* Client Image */}
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24 md:w-28 md:h-28">
                      <Image
                        src={testimonials[currentTestimonial].image}
                        alt={testimonials[currentTestimonial].name}
                        width={112}
                        height={112}
                        className="rounded-full object-cover border-4 border-primary-200 shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-3">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="inline h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-1">
                      {testimonials[currentTestimonial].name}
                    </h3>
                    <p className="text-gray-600 text-base mb-1">{testimonials[currentTestimonial].company}</p>
                    {testimonials[currentTestimonial].duration && (
                      <p className="text-primary-600 font-semibold text-sm inline-block bg-primary-50 px-3 py-1 rounded-full">
                        {testimonials[currentTestimonial].duration}
                      </p>
                    )}
                  </div>

                  {/* Navigation Buttons - Desktop */}
                  <div className="hidden md:flex gap-2 flex-shrink-0">
                    <button
                      onClick={prevTestimonial}
                      aria-label="Previous Testimonial"
                      className="w-10 h-10 rounded-full bg-white border-2 border-primary-600 text-primary-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      aria-label="Next Testimonial"
                      className="w-10 h-10 rounded-full bg-white border-2 border-primary-600 text-primary-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Quote Icon and Text */}
                <div className="relative">
                  <Quote className="h-10 w-10 text-primary-200 mb-3" />
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic mb-6">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                </div>

                {/* Testimonial Indicators */}
                <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonials">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      role="tab"
                      aria-selected={currentTestimonial === index}
                      aria-label={`View testimonial ${index + 1}`}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${currentTestimonial === index
                        ? "bg-primary-600 w-8"
                        : "bg-gray-300 w-2 hover:bg-gray-400"
                        }`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons - Mobile */}
                <div className="flex md:hidden justify-center gap-3 mt-6">
                  <button
                    onClick={prevTestimonial}
                    aria-label="Previous Testimonial"
                    className="w-12 h-12 rounded-full bg-white border-2 border-primary-600 text-primary-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    aria-label="Next Testimonial"
                    className="w-12 h-12 rounded-full bg-white border-2 border-primary-600 text-primary-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Why Choose Us - Reduced Height */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose Sunidhi Securities?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the advantage of working with a trusted financial partner
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: `${yearsOfExcellence}+ Years Legacy`,
                description: "Over six decades of excellence in financial services and wealth management",
              },
              {
                icon: Shield,
                title: "SEBI Registered",
                description: "Fully compliant and regulated broker ensuring your investments are secure",
              },
              {
                icon: Zap,
                title: "Advanced Technology",
                description: "Cutting-edge trading platforms for seamless execution and analysis",
              },
              {
                icon: Users,
                title: "Expert Support",
                description: "Dedicated relationship managers and expert advisory services",
              },
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-2 hover:border-primary-500">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA - Reduced Height */}
      <section className="py-12 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Ready to Start Stock Market Trading?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Open trading account today for stock market trading, intraday trading, commodity market, and forex trading in India with best trading app in India
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8"
              >
                <Link href="/open-account">
                  Open Free Trading Account
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 text-lg px-8"
              >
                <Link href="/support/contact">
                  Talk to Expert
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
