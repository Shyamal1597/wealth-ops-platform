'use client';

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Award as AwardIcon } from "lucide-react";

interface Award {
  id: string;
  year: string;
  title: string;
  description: string;
}

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const response = await fetch('/api/awards');
      const data = await response.json();
      setAwards(data.awards || []);
    } catch (error) {
      console.error('Error fetching awards:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Awards & Recognition</h1>
          <p className="text-xl text-white">Celebrating excellence and achievements</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading awards...</p>
            </div>
          ) : awards.length === 0 ? (
            <div className="text-center py-12">
              <AwardIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No awards available at the moment</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {awards.map((award) => (
                <div key={award.id} className="flex gap-4 p-6 bg-white border rounded-lg">
                  <AwardIcon className="h-12 w-12 text-primary-600 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">{award.year}</div>
                    <h3 className="text-xl font-semibold mb-2">{award.title}</h3>
                    <p className="text-gray-600">{award.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
