import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Shield, CheckCircle2, BarChart3, FileText, Award } from "lucide-react";

export default function ResearchPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Research</h1>
          <p className="text-xl text-primary-100">
            We partake in niche research with a special focus on mid-caps to generate absolute return structural ideas.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Sunidhi carries out in-depth equity research, which involves the analysis of global as well as domestic trends. We then zoom in to the best fundamental companies with reasonable valuations. This research is showcased to institutional investors to help them in their investment decisions. Sunidhi engages in niche research with a special focus on mid-caps. Our goal is to generate absolute return structural ideas. We predominantly cater to all leading Indian mutual funds and insurance companies.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <BarChart3 className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Global</h3>
                <p className="text-gray-600">Coverage</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Mid-cap</h3>
                <p className="text-gray-600">Focus</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Institutional</h3>
                <p className="text-gray-600">Clients</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
