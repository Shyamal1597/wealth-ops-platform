"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { GraduationCap, Users, Heart, Trophy, Sparkles, ImageIcon } from "lucide-react";

interface LifeImage {
  id: string;
  title: string;
  category: string;
  image: string;
  order: number;
}

export default function LifeAtSunidhiPage() {
  const [images, setImages] = useState<LifeImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/life-images');
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Error fetching life images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image by category
  const getImageByCategory = (category: string) => {
    return images.find(img => img.category === category);
  };

  // Get images by category
  const mainImage = getImageByCategory('main');
  const workCultureImage = getImageByCategory('work-culture');
  const funAtWorkImages = images.filter(img => img.category === 'fun-at-work');
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Life at Sunidhi</h1>
          <p className="text-xl text-primary-100">Where passion meets purpose</p>
        </Container>
      </section>

      {/* Main Introduction */}
      <section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  LIFE AT SUNIDHI
                </h2>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>
                    The people at Sunidhi are at the core of the organisation's success. We are a team of passionate and resourceful individuals. As a one-stop solution for every small and big financial need in India, we work together to ensure that our best foot is put forward for those who believe in us – always in a transparent manner.
                  </p>
                  <p>
                    Here are a few activities and initiatives that we undertake to keep our family engaged, enriched and happy:
                  </p>
                </div>
              </div>
              {loading ? (
                <div className="relative h-96 rounded-lg overflow-hidden shadow-xl bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : mainImage ? (
                <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={mainImage.image}
                    alt={mainImage.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : (
                <div className="relative h-96 rounded-lg overflow-hidden shadow-xl bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Learning and Development */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <GraduationCap className="h-12 w-12 text-primary-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Learning and Development
              </h2>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  At Sunidhi, employees are constantly encouraged to learn because that is the only way forward. Learning and growth are directly proportionate to each other and the lack of knowledge should not curtail growth.
                </p>
                <p>
                  To ensure this, we motivate our employees to update their skills periodically through education. This motivation is backed by support through topical and relevant training programmes. These are organised regularly for every department.
                </p>
                <p>
                  We also extend support to employees who want to enrich their profiles with further studies and propel their careers.
                </p>
                <p>
                  We look forward to nurturing young talent to learn and gain experience with us; we do so by hiring interns regularly.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Work Culture */}
      <section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Heart className="h-12 w-12 text-primary-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                WORK CULTURE
              </h2>
            </div>

            {/* Work Culture Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {loading ? (
                <div className="relative h-96 rounded-lg overflow-hidden shadow-xl bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : workCultureImage ? (
                <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={workCultureImage.image}
                    alt={workCultureImage.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="relative h-96 rounded-lg overflow-hidden shadow-xl bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary-600">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary-600" />
                    Employee Friendly Policies
                  </h3>
                  <p className="text-gray-700">
                    Our employee-centric policies and work culture have supported Sunidhi's members through various curves in their personal life.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary-600">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary-600" />
                    Empowering Environment
                  </h3>
                  <p className="text-gray-700">
                    We promote a proactive workplace, one where you're encouraged to make your own decisions, and take ownership of their ripples and ramifications. In doing so, we encourage individual responsibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Fun @ Work */}
            <div className="bg-gray-50 rounded-lg p-8 mb-12 border-2 border-primary-600">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-8 w-8 text-primary-600" />
                <h3 className="text-2xl font-bold text-gray-900">Fun @ Work</h3>
              </div>
              <p className="text-lg text-gray-700 mb-8">
                While every day is a celebration when doing what you love, we make it a point to celebrate a few momentous days as a family.
              </p>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading images...</p>
                </div>
              ) : funAtWorkImages.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {funAtWorkImages.map((img) => (
                    <div key={img.id} className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={img.image}
                        alt={img.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No fun at work images available</p>
                </div>
              )}
            </div>

            {/* Activities Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-white border-2 border-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎉</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Special Days</h4>
                <p className="text-gray-600">
                  Sunidhi celebrates women's day, national days and employee birthdays with gusto. Annual picnics and departmental outings are also part of the fun.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-white border-2 border-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚽</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Sports</h4>
                <p className="text-gray-600">
                  We promote a proactive workplace, one where you're encouraged to make your own decisions, and take ownership of their ripples and ramifications. In doing so, we encourage individual responsibility.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-white border-2 border-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎊</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Festivities</h4>
                <p className="text-gray-600">
                  A secular team, we celebrate Diwali, Christmas and Eid to the fullest.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Team
            </h2>
            <p className="text-xl mb-8 text-white">
              Be part of a family that values growth, learning, and celebration.
            </p>
            <a
              href="/about/careers"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              View Career Opportunities
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
