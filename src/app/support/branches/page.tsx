import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";

export default function BranchesPage() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Branch Locator</h1>
          <p className="text-xl text-primary-100">Find a Sunidhi Securities branch near you</p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by city, state, or PIN code..."
              className="w-full max-w-2xl border rounded-md px-4 py-3"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary-600" />
                    {branch.city}
                  </CardTitle>
                  <CardDescription>{branch.area}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{branch.address}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary-600" />
                    <span>{branch.phone}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Branch information is for demonstration. In production, this would be
              integrated with a maps API and live branch database.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

const branches = [
  {
    city: "Mumbai",
    area: "Nariman Point",
    address: "123 Financial District, Nariman Point, Mumbai 400001",
    phone: "+91-22-1234-5678"
  },
  {
    city: "Delhi",
    area: "Connaught Place",
    address: "45 CP Building, Connaught Place, New Delhi 110001",
    phone: "+91-11-2345-6789"
  },
  {
    city: "Bangalore",
    area: "MG Road",
    address: "78 MG Road, Bangalore 560001",
    phone: "+91-80-3456-7890"
  },
  {
    city: "Chennai",
    area: "T Nagar",
    address: "34 Usman Road, T Nagar, Chennai 600017",
    phone: "+91-44-4567-8901"
  },
  {
    city: "Kolkata",
    area: "Park Street",
    address: "56 Park Street, Kolkata 700016",
    phone: "+91-33-5678-9012"
  },
  {
    city: "Pune",
    area: "Camp",
    address: "90 MG Road, Camp, Pune 411001",
    phone: "+91-20-6789-0123"
  }
];
