import { Container } from "@/components/ui/container";
import { Award, Users, TrendingUp, Target, Heart, BookOpen, Quote } from "lucide-react";
import { MarqueeBanner } from "@/components/ui/MarqueeBanner";

export default function OurStoryPage() {
  return (
    <>
      {/* Marquee Banner */}
      <MarqueeBanner />

      <section className="bg-black text-white py-12">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Story</h1>
          <p className="text-xl text-white">Legacy of Excellence in Financial Services Since 1957</p>
        </Container>
      </section>

      {/* The Sunidhi Edge */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              The Sunidhi Edge
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Sunidhi Group was founded in the 1960s as a stock broking enterprise by Late Jasvantlal Parekh,
                Late Jayantilal Shah, and Late Dhirajlal Parekh. It aims to leverage years of experience and
                business knowledge for sustainable gains and growing capital.
              </p>
              <p>
                Sunidhi offers high-quality, cost-effective services to financial institutions, banks, corporates,
                HNIs, retail clients, and individuals. Over the years, its reach has grown beyond 70 locations,
                45,000 clients, and 150 institutions – and counting.
              </p>
              <p>
                This generation of leadership brings the perfect blend of solid subject-matter expertise, business
                acumen and moral grounding. Arun Shah, Jayesh Parekh and Bimal Parekh have leveraged their inherent
                capability to expand Sunidhi's reach and impact.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Focus */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Focus</h2>
            <p className="text-xl text-gray-700">
              Deliver up-to-date financial solutions to all stakeholders.
            </p>
          </div>
        </Container>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">Our Values</h2>
            <p className="text-xl text-gray-700 text-center mb-12">
              Partner with those who reflect our high standards of transparency, integrity and quality.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <Award className="h-8 w-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust and Integrity</h3>
                    <p className="text-gray-700">
                      We believe in long term relations, for which we live out and maintain utmost trust and integrity with our stakeholders.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <Users className="h-8 w-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Focus</h3>
                    <p className="text-gray-700">
                      We are here for our customers, thus believe in continuously enhancing every part of their experience with Sunidhi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <BookOpen className="h-8 w-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Learning & Growth</h3>
                    <p className="text-gray-700">
                      We understand that only change is constant, thus we keep expanding our horizon of knowledge for persistent growth.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <Heart className="h-8 w-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Empathy</h3>
                    <p className="text-gray-700">
                      We go by the quote "Happy employees lead to Happy customers." We have created a culture where employees are empowered to give their best performance as well as focus on their personal life.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-primary-600 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-white">
              Empower stakeholders to create, protect and enhance their wealth using our experience, knowledge, expertise and cutting-edge technology.
            </p>
          </div>
        </Container>
      </section>

      {/* Group Companies */}
      <section className="py-16">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Group Companies
            </h2>

            <div className="space-y-8">
              {/* Sunidhi Securities & Finance Ltd */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-primary-600 mb-6">
                  Sunidhi Securities & Finance Ltd.
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">The National Stock Exchange of India Limited (NSE)</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Capital Market Segment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Debt Market Segment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Futures & Options Segment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Currency Derivative Segment</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Bombay Stock Exchange (BSE)</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Capital Market Segment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Futures & Options Segment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Currency Derivative Segment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Debt Market Segment</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Metropolitan Stock Exchange of India Limited (MSEI)</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Capital Market Segment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Futures & Options Segment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Currency Derivative Segment</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Commodity Exchanges</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>The Multi Commodity Exchange of India Limited (MCX)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>The National Commodity & Derivatives Exchange Limited (NCDEX)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Other Services</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Central Depository Services India Limited (Depository Participant)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Foreign Exchange Dealers Association of India (Forex Brokers)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sunidhi Capital Pvt Ltd */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-primary-600 mb-3">
                  Sunidhi Capital Pvt Ltd
                </h3>
                <p className="text-gray-700">
                  Non-Banking Finance Company (registered with Reserve Bank of India)
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Promoter's Message */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Promoter's Message
            </h2>
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border-2 border-primary-200">
              <Quote className="h-12 w-12 text-primary-400 mb-4" />
              <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                "Sunidhi finds its roots in the early 1960s as a stock broking enterprise by Late Jasvantlal Parekh, Late Jayantilal Shah, and Late Dhirajlal Parekh. Over the decades, we have evolved into a comprehensive financial services provider, serving thousands of clients across India.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                Our journey has been built on the foundation of trust, integrity, and unwavering commitment to our clients' financial success. Today, we continue to honor this legacy by combining traditional values with modern technology to deliver exceptional service.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed italic">
                As we look to the future, we remain dedicated to empowering our clients to create, protect, and enhance their wealth. In your prosperity truly lies our success."
              </p>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-900 font-semibold text-lg">The Sunidhi Leadership Team</p>
                <p className="text-gray-600 mt-1">Arun Shah, Jayesh Parekh & Bimal Parekh</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
