"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FlightOffer } from "@/types";
import { ArrowRight, Plane } from "lucide-react";
import { bookFlight } from "@/app/actions/flight-actions";

interface FlightCardProps {
  flight: FlightOffer;
  userId: string;
}

export default function FlightCard({ flight, userId }: FlightCardProps) {
  const router = useRouter();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBook = async () => {
    console.log(flight);

    if (!passengerName || !passengerEmail) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const result = await bookFlight(
        flight.id,

        passengerName,
        passengerEmail
      );

      setIsBookingOpen(false);
      router.push(`/booking-confirmation/${result.bookingId}`);
    } catch (error: any) {
      alert(error.message || "Failed to book flight");
    } finally {
      setIsLoading(false);
    }
  };

  // Format duration (PT2H30M -> 2h 30m)
  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;

    const hours = match[1] ? match[1].replace("H", "") : "0";
    const minutes = match[2] ? match[2].replace("M", "") : "0";

    return `${hours}h ${minutes}m`;
  };

  // Calculate arrival time
  const getDepartureTime = () => {
    const time = flight.departureTime.split(":");
    return `${time[0]}:${time[1]}`;
  };

  const getArrivalTime = () => {
    const time = flight.arrivalTime.split(":");
    return `${time[0]}:${time[1]}`;
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              <Plane className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="font-semibold">{flight.airline}</p>
              <p className="text-sm text-gray-500">{flight.flightNumber}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto">
            <div className="text-center">
              <p className="text-xl font-bold">{getDepartureTime()}</p>
              <p className="text-sm text-gray-500">{flight.source.iataCode}</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500">
                {formatDuration(flight.duration)}
              </p>
              <div className="relative w-24 md:w-32">
                <div className="absolute top-1/2 w-full h-0.5 bg-gray-300"></div>
                <ArrowRight className="absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">
                {flight.stops === 0 ? "Direct" : `${flight.stops} stop`}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xl font-bold">{getArrivalTime()}</p>
              <p className="text-sm text-gray-500">
                {flight.destination.iataCode}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end mt-4 md:mt-0 w-full md:w-auto">
            <p className="text-2xl font-bold text-rose-600">
              ₹{flight.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              {flight.cabinClass.replace("_", " ")}
            </p>

            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button className="mt-2 bg-rose-600 hover:bg-rose-700">
                  Book Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book Your Flight</DialogTitle>
                  <DialogDescription>
                    Enter passenger details to complete your booking.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      className="col-span-3"
                    />
                  </div>

                  <div className="border-t pt-4 mt-2">
                    <div className="flex justify-between mb-2">
                      <span>Flight</span>
                      <span>
                        {flight.airline} {flight.flightNumber}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Route</span>
                      <span>
                        {flight.source.iataCode} → {flight.destination.iataCode}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Date</span>
                      <span>{flight.departureDate}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Time</span>
                      <span>
                        {getDepartureTime()} - {getArrivalTime()}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total Price</span>
                      <span className="text-rose-600">
                        ₹{flight.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsBookingOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBook}
                    disabled={isLoading}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    {isLoading ? "Processing..." : "Confirm Booking"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
