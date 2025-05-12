// "use client"

// import { useState, useEffect } from "react"
// import { useSearchParams } from "next/navigation"
// import Header from "@/components/header"
// import FlightCard from "@/components/flight-card"
// import FlightFilters from "@/components/flight-filters"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import type { FlightOffer } from "@/types"
// import { searchFlightOffers } from "@/app/actions/flight-actions"
// import { ArrowLeft, ArrowRight, Filter } from "lucide-react"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// export default function SearchPage() {
//   const searchParams = useSearchParams()
//   const [flights, setFlights] = useState<FlightOffer[]>([])
//   const [filteredFlights, setFilteredFlights] = useState<FlightOffer[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   // Mock user ID for demo purposes
//   const userId = "user-123"

//   useEffect(() => {
//     const fetchFlights = async () => {
//       try {
//         setLoading(true)

//         const origin = searchParams.get("origin")
//         const destination = searchParams.get("destination")
//         const departureDate = searchParams.get("departureDate")
//         const returnDate = searchParams.get("returnDate")
//         const passengers = searchParams.get("passengers")
//         const cabinClass = searchParams.get("cabinClass")

//         if (!origin || !destination || !departureDate) {
//           throw new Error("Missing required search parameters")
//         }

//         const results = await searchFlightOffers({
//           origin,
//           destination,
//           departureDate,
//           returnDate: returnDate || undefined,
//           passengers: Number.parseInt(passengers || "1"),
//           cabinClass: cabinClass || "ECONOMY",
//         })

//         setFlights(results)
//         setFilteredFlights(results)
//       } catch (err: any) {
//         console.error("Error fetching flights:", err)
//         setError(err.message || "Failed to fetch flights")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchFlights()
//   }, [searchParams])

//   const handleFilterChange = (filtered: FlightOffer[]) => {
//     setFilteredFlights(filtered)
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       weekday: "short",
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     })
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       <main className="container mx-auto px-4 py-8">
//         <div className="mb-6">
//           <Button variant="ghost" className="mb-4">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Search
//           </Button>

//           <div className="bg-white rounded-lg shadow p-4 mb-6">
//             <div className="flex flex-wrap items-center justify-between">
//               <div>
//                 <h1 className="text-xl font-bold">
//                   {searchParams.get("origin")} to {searchParams.get("destination")}
//                 </h1>
//                 <p className="text-gray-600">
//                   {searchParams.get("departureDate") && formatDate(searchParams.get("departureDate")!)}
//                   {searchParams.get("returnDate") && (
//                     <>
//                       <ArrowRight className="inline mx-2 h-4 w-4" />
//                       {formatDate(searchParams.get("returnDate")!)}
//                     </>
//                   )}
//                   {" · "}
//                   {searchParams.get("passengers") || "1"} Passenger(s)
//                   {" · "}
//                   {searchParams.get("cabinClass")?.replace("_", " ") || "Economy"}
//                 </p>
//               </div>

//               <div className="mt-2 sm:mt-0">
//                 <Sheet>
//                   <SheetTrigger asChild>
//                     <Button variant="outline" className="lg:hidden">
//                       <Filter className="mr-2 h-4 w-4" />
//                       Filters
//                     </Button>
//                   </SheetTrigger>
//                   <SheetContent side="left">
//                     <div className="py-4">
//                       <h2 className="text-lg font-semibold mb-4">Filters</h2>
//                       <FlightFilters flights={flights} onFilterChange={handleFilterChange} />
//                     </div>
//                   </SheetContent>
//                 </Sheet>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             <div className="hidden lg:block">
//               <FlightFilters flights={flights} onFilterChange={handleFilterChange} />
//             </div>

//             <div className="lg:col-span-3">
//               {loading ? (
//                 <div className="space-y-4">
//                   {[...Array(3)].map(
//                     (_, i) =>
//                     (
//                       <div key={i} className="bg-white rounded-lg shadow p-6">
//                         <div className="flex justify-between">
//                           <div className="flex items-center">
//                             <Skeleton className="h-12 w-12 rounded-full" />
//                             <div className="ml-4">
//                               <Skeleton className="h-4 w-24" />
//                               <Skeleton className="h-4 w-16 mt-2" />
//                             </div>
//                           </div>
//                           <div className="flex items-center space-x-8">
//                             <div>
//                               <Skeleton className="h-6 w-16" />
//                               <Skeleton className="h-4 w-12 mt-1" />
//                             </div>
//                             <div className="flex flex-col items-center  />
//                           </div>
//                           <div className="flex flex-col items-center\">
//                             <Skeleton className="h-4 w-24" />
//                             <Skeleton className="h-1 w-32 mt-2" />
//                             <Skeleton className="h-4 w-16 mt-1" />
//                           </div>
//                           <div>
//                             <Skeleton className="h-6 w-16" />
//                             <Skeleton className="h-4 w-12 mt-1" />
//                           </div>
//                         </div>
//                         <div>
//                           <Skeleton className="h-6 w-24" />
//                           <Skeleton className="h-4 w-16 mt-1" />
//                           <Skeleton className="h-10 w-24 mt-2" />
//                         </div>
//                       </div>
//                     </div>
//               ),

//                   )}
//                 </div>
//               ) : error ? (
//                 <div className="bg-white rounded-lg shadow p-6 text-center">
//                   <p className="text-red-500">{error}</p>
//                   <Button onClick={() => window.location.reload()} className="mt-4">
//                     Try Again
//                   </Button>
//                 </div>
//               ) : filteredFlights.length === 0 ? (
//                 <div className="bg-white rounded-lg shadow p-6 text-center">
//                   <p className="text-gray-500">No flights found matching your criteria.</p>
//                   <Button onClick={() => setFilteredFlights(flights)} className="mt-4">
//                     Reset Filters
//                   </Button>
//                 </div>
//               ) : (
//                 <div>
//                   <p className="mb-4 text-gray-600">{filteredFlights.length} flights found</p>
//                   {filteredFlights.map((flight) => (
//                     <FlightCard key={flight.id} flight={flight} userId={userId} />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       <footer className="bg-gray-800 text-white py-8">
//         <div className="container mx-auto px-4">
//           <div className="text-center">
//             <p>&copy; 2025 Dynamic Flight System. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div >

// }
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import FlightCard from "@/components/flight-card";
import FlightFilters from "@/components/flight-filters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { FlightOffer } from "@/types";
import { searchFlightOffers } from "@/app/actions/flight-actions";
import { ArrowLeft, ArrowRight, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = "user-123"; // demo user

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);

        const origin = searchParams.get("origin");
        const destination = searchParams.get("destination");
        const departureDate = searchParams.get("departureDate");
        const returnDate = searchParams.get("returnDate");
        const passengers = searchParams.get("passengers");
        const cabinClass = searchParams.get("cabinClass");

        if (!origin || !destination || !departureDate) {
          throw new Error("Missing required search parameters");
        }

        const results = await searchFlightOffers({
          origin,
          destination,
          departureDate,
          returnDate: returnDate || undefined,
          passengers: Number.parseInt(passengers || "1"),
          cabinClass: cabinClass || "ECONOMY",
        });

        setFlights(results);
        setFilteredFlights(results);
      } catch (err: any) {
        console.error("Error fetching flights:", err);
        setError(err.message || "Failed to fetch flights");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParams]);

  const handleFilterChange = (filtered: FlightOffer[]) => {
    setFilteredFlights(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">
                {searchParams.get("origin")} to{" "}
                {searchParams.get("destination")}
              </h1>
              <p className="text-gray-600">
                {searchParams.get("departureDate") &&
                  formatDate(searchParams.get("departureDate")!)}
                {searchParams.get("returnDate") && (
                  <>
                    <ArrowRight className="inline mx-2 h-4 w-4" />
                    {formatDate(searchParams.get("returnDate")!)}
                  </>
                )}
                {" · "}
                {searchParams.get("passengers") || "1"} Passenger(s)
                {" · "}
                {searchParams.get("cabinClass")?.replace("_", " ") || "Economy"}
              </p>
            </div>

            <div className="mt-2 sm:mt-0">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="py-4">
                    <h2 className="text-lg font-semibold mb-4">Filters</h2>
                    <FlightFilters
                      flights={flights}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block">
            <FlightFilters
              flights={flights}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="ml-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16 mt-2" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div>
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-4 w-12 mt-1" />
                        </div>
                        <div className="flex flex-col items-center">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-1 w-32 mt-2" />
                          <Skeleton className="h-4 w-16 mt-1" />
                        </div>
                        <div>
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-4 w-12 mt-1" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-16 mt-1" />
                      <Skeleton className="h-10 w-24 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-red-500">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">
                  No flights found matching your criteria.
                </p>
                <Button
                  onClick={() => setFilteredFlights(flights)}
                  className="mt-4"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-gray-600">
                  {filteredFlights.length} flights found
                </p>
                {filteredFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} userId={userId} />
                ))}
              </div>
            )}
          </div>
        </div>
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
