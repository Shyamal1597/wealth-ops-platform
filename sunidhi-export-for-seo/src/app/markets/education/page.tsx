import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, FileText } from "lucide-react";

export default function EducationPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Educational Resources</h1>
          <p className="text-xl text-primary-100">Learn trading and investment basics</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary-600 mb-2" />
                <CardTitle>Trading Basics</CardTitle>
                <CardDescription>
                  Learn the fundamentals of stock market trading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Introduction to Stock Markets</li>
                  <li>• Understanding Stock Prices</li>
                  <li>• Order Types and Execution</li>
                  <li>• Risk Management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Video className="h-10 w-10 text-primary-600 mb-2" />
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Watch expert-led video courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Technical Analysis Basics</li>
                  <li>• Fundamental Analysis</li>
                  <li>• Options Trading Strategies</li>
                  <li>• Portfolio Management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary-600 mb-2" />
                <CardTitle>Glossary</CardTitle>
                <CardDescription>
                  Understand key trading terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Bull Market</li>
                  <li>• Bear Market</li>
                  <li>• Blue Chip Stocks</li>
                  <li>• Market Capitalization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
