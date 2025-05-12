import Header from "@/components/header";
import FlightSearchForm from "@/components/flight-search-form";
import { Plane, MapPin, Clock, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-rose-500 to-rose-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Book Your Flights with Dynamic Pricing
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Find the best deals on flights with our dynamic pricing system.
                The earlier you book, the better the price!
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <FlightSearchForm />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Us
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                <p className="text-gray-600">
                  Choose from thousands of flights to destinations worldwide.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Global Destinations
                </h3>
                <p className="text-gray-600">
                  Explore hundreds of destinations across the globe.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dynamic Pricing</h3>
                <p className="text-gray-600">
                  Our unique pricing algorithm ensures you get the best deals.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
                <p className="text-gray-600">
                  Book with confidence with our secure payment system.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2025 Dynamic Flight System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
