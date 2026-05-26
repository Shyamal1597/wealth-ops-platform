import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function IPOPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">IPO Center</h1>
          <p className="text-xl text-primary-100">Apply for IPOs online with ease</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-2xl font-bold mb-6">Current IPOs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>TechCorp India Limited</CardTitle>
                <CardDescription>Technology Sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Size:</span>
                    <span className="font-semibold">₹500 Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Band:</span>
                    <span className="font-semibold">₹120 - ₹130</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Opens:</span>
                    <span className="font-semibold">Dec 20, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Closes:</span>
                    <span className="font-semibold">Dec 22, 2025</span>
                  </div>
                </div>
                <Button className="w-full">Apply Now</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GreenEnergy Solutions</CardTitle>
                <CardDescription>Renewable Energy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Size:</span>
                    <span className="font-semibold">₹800 Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Band:</span>
                    <span className="font-semibold">₹200 - ₹220</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Opens:</span>
                    <span className="font-semibold">Dec 25, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Closes:</span>
                    <span className="font-semibold">Dec 27, 2025</span>
                  </div>
                </div>
                <Button className="w-full">Apply Now</Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
