'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock } from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  active: boolean;
  postedDate: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/careers');
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Careers</h1>
          <p className="text-xl text-white">Join our team and shape the future of finance</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              At Sunidhi Securities, we believe our people are our greatest asset. We offer a dynamic
              work environment, competitive compensation, continuous learning opportunities, and a
              culture that values innovation and collaboration.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-6">Current Openings</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading job openings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No open positions at the moment</p>
              <p className="text-gray-400 text-sm mt-2">
                Please check back later for new opportunities
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="mt-2 flex flex-wrap gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.experience}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <Button asChild>
                      <Link href="/support/contact">Apply Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
