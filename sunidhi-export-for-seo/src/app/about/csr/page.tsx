"use client";

import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Heart, GraduationCap, Stethoscope, PawPrint } from "lucide-react";

export default function CSRPage() {
  const pdfUrl = "/SSFL-CSR-Policy.pdf";

  const handleViewPDF = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CSR & Sunidhi Foundation
          </h1>
          <p className="text-xl text-white">
            Our commitment to society and sustainable development
          </p>
        </Container>
      </section>

      {/* Sunidhi Foundation Section */}
      <section className="py-16 bg-primary-600 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sunidhi Foundation
            </h2>
            <p className="text-xl text-white">
              Uplift the quality of life across communities through integrated and sustainable development
            </p>
          </div>
        </Container>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-700 mb-4">
              "To get the full value of joy you must have someone to divide it with."
            </blockquote>
            <p className="text-lg text-gray-600">- Mark Twain</p>
          </div>
        </Container>
      </section>

      {/* Foundation Introduction with Image */}
      <section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl order-2 lg:order-1">
                <Image
                  src="/images/180404-Sunidhi-Foundation_09.jpg"
                  alt="Sunidhi Foundation"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  The Power of Giving
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Sunidhi has always believed in the power of giving. Our actions promote our belief in humanity and philanthropy to make our world a better place.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Sunidhi Charity Foundation actively supports institutions and organisations that stand for causes that are close to our hearts. The sectors we are present in are education, healthcare (homes for the physically and mentally challenged) and animal care centres. The Foundation is part of Sunidhi's social responsibility agenda.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Foundation Focus Areas */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Foundation Focus Areas
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="bg-white border-2 border-primary-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Education</h3>
                <p className="text-gray-600">
                  Supporting educational institutions and programs that provide opportunities for underprivileged students to achieve their dreams.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="bg-white border-2 border-primary-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Stethoscope className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Healthcare</h3>
                <p className="text-gray-600">
                  Providing support to healthcare facilities and homes for the physically and mentally challenged, ensuring quality care for all.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="bg-white border-2 border-primary-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PawPrint className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Animal Care</h3>
                <p className="text-gray-600">
                  Supporting animal care centres and welfare organizations dedicated to the protection and care of animals.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Hospital Support Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Healthcare Support
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Sunidhi offers support to a 50-bed ward at K J Somaiya Hospital and Research Center in Mumbai. This is a leaf out of our book of giving.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We hope and work towards our efforts bringing a smile to the faces of the less fortunate. We look at our donations as a humble way to reduce inequity.
                </p>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/180404-Sunidhi-Foundation_07.jpg"
                  alt="K J Somaiya Hospital Support"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CSR Policy Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Corporate Social Responsibility
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <FileText className="h-20 w-20 text-primary-600 mb-6" />

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  CSR Policy Document
                </h3>

                <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                  At Sunidhi Securities & Finance Limited, we believe in giving back to society and contributing to sustainable development. Our CSR policy outlines our commitment to social responsibility and community welfare.
                </p>

                <div className="bg-gray-50 rounded-md p-6 mb-8 w-full">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Document Details
                  </h4>
                  <div className="text-left space-y-2 text-gray-600">
                    <p><strong>Document:</strong> SSFL CSR Policy</p>
                    <p><strong>Format:</strong> PDF</p>
                    <p><strong>Organization:</strong> Sunidhi Securities & Finance Limited</p>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleViewPDF}
                  className="w-full sm:w-auto"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  View CSR Policy (PDF)
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CSR Highlights */}
      <section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Our CSR Focus Areas
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Sustainability
                </h3>
                <p className="text-sm text-gray-600">
                  Committed to environmental sustainability and responsible business practices
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Community Development
                </h3>
                <p className="text-sm text-gray-600">
                  Supporting local communities through various social initiatives
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Education & Healthcare
                </h3>
                <p className="text-sm text-gray-600">
                  Investing in education and healthcare for underprivileged sections
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-primary-600 p-6 rounded-r-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Key CSR Initiatives
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Education and skill development programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Healthcare and sanitation initiatives</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Environmental sustainability projects</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Support for rural development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Women empowerment programs</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Making a Difference Together
            </h2>
            <p className="text-xl text-white mb-8">
              Through our CSR initiatives and Sunidhi Foundation, we continue our commitment to creating a positive impact on society and uplifting communities.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
