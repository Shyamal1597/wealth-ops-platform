import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketOverviewPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Market Overview</h1>
          <p className="text-xl text-primary-100">Real-time market data and insights</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Indices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Nifty 50</span>
                    <span className="text-green-600 font-semibold">+0.85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sensex</span>
                    <span className="text-green-600 font-semibold">+0.92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bank Nifty</span>
                    <span className="text-red-600 font-semibold">-0.35%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Gainers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Stock A</span>
                    <span className="text-green-600">+5.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock B</span>
                    <span className="text-green-600">+4.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock C</span>
                    <span className="text-green-600">+4.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Losers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Stock X</span>
                    <span className="text-red-600">-3.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock Y</span>
                    <span className="text-red-600">-2.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock Z</span>
                    <span className="text-red-600">-2.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Market data displayed is for demonstration purposes only.
              Actual real-time data will be integrated via API in the production version.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
