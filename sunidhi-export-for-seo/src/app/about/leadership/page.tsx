"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

interface Leader {
  id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  order: number;
}

interface TimelineItem {
  id: string;
  image: string;
  caption: string;
  order: number;
}

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchLeaders();
    fetchTimeline();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timeline.length]);

  const fetchLeaders = async () => {
    try {
      const response = await fetch('/api/leadership');
      const data = await response.json();
      setLeaders(data.leaders || []);
    } catch (error) {
      console.error('Error fetching leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      const response = await fetch('/api/timeline');
      const data = await response.json();
      setTimeline(data.timeline || []);
    } catch (error) {
      console.error('Error fetching timeline:', error);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % timeline.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + timeline.length) % timeline.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Leadership Team</h1>
          <p className="text-xl text-white">Meet the people driving our vision forward</p>
        </Container>
      </section>

      {/* Leadership Team */}
      <section className="py-16">
        <Container>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading leadership team...</p>
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No leadership information available at the moment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {leaders.map((leader) => (
                <Card key={leader.id} className="text-center">
                  <CardHeader>
                    <div className="w-56 h-56 mx-auto mb-4 relative rounded-lg overflow-hidden">
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority={leader.order <= 2}
                        loading={leader.order <= 2 ? "eager" : "lazy"}
                      />
                    </div>
                    <CardTitle className="text-center text-xl">{leader.name}</CardTitle>
                    <p className="text-center text-sm text-gray-600 font-medium">{leader.position}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 text-center">{leader.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Timeline Carousel */}
      {timeline.length > 0 && (
        <section className="py-16 bg-gray-50">
          <Container>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Our Journey Through the Years
            </h2>

            <div className="relative max-w-5xl mx-auto">
              {/* Main Image */}
              <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src={timeline[currentIndex].image}
                  alt={timeline[currentIndex].caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                  priority
                />
              </div>

              {/* Caption */}
              <div className="mt-6 text-center px-4">
                <p className="text-xl font-semibold text-gray-900">{timeline[currentIndex].caption}</p>
                <p className="text-sm text-gray-600 mt-2">Image {currentIndex + 1} of {timeline.length}</p>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Dot Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {timeline.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all ${
                      index === currentIndex
                        ? 'w-8 h-3 bg-primary-600 rounded-full'
                        : 'w-3 h-3 bg-gray-400 rounded-full hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Keyboard Navigation Hint */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Use arrow keys or click the arrows to navigate
              </p>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

