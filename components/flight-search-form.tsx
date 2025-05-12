"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plane, Search } from "lucide-react";
import { searchAirports } from "@/lib/amadeus";
import type { Airport } from "@/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function FlightSearchForm() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    undefined
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState("1");
  const [cabinClass, setCabinClass] = useState("ECONOMY");
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  const [originAirports, setOriginAirports] = useState<Airport[]>([]);
  const [destinationAirports, setDestinationAirports] = useState<Airport[]>([]);
  const [originSearchOpen, setOriginSearchOpen] = useState(false);
  const [destinationSearchOpen, setDestinationSearchOpen] = useState(false);
  const [originSearchValue, setOriginSearchValue] = useState("");
  const [destinationSearchValue, setDestinationSearchValue] = useState("");
  const [originCode, setOriginCode] = useState("");
  const [destinationCode, setDestinationCode] = useState("");

  const handleOriginSearch = async (value: string) => {
    setOriginSearchValue(value);
    if (value.length >= 2) {
      try {
        const airports = await searchAirports(value);
        setOriginAirports(airports);
      } catch (error) {
        console.error("Error searching airports:", error);
      }
    }
  };

  const handleDestinationSearch = async (value: string) => {
    setDestinationSearchValue(value);
    if (value.length >= 2) {
      try {
        const airports = await searchAirports(value);
        setDestinationAirports(airports);
      } catch (error) {
        console.error("Error searching airports:", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!originCode || !destinationCode || !departureDate) {
      alert("Please fill in all required fields");
      return;
    }

    const searchParams = new URLSearchParams({
      origin: originCode,
      destination: destinationCode,
      departureDate: format(departureDate, "yyyy-MM-dd"),
      passengers,
      cabinClass,
    });

    if (isRoundTrip && returnDate) {
      searchParams.append("returnDate", format(returnDate, "yyyy-MM-dd"));
    }

    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="bg-black rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          type="button"
          variant={!isRoundTrip ? "default" : "outline"}
          onClick={() => setIsRoundTrip(false)}
          className="flex-1 bg-purple"
        >
          One Way
        </Button>
        <Button
          type="button"
          variant={isRoundTrip ? "default" : "outline"}
          onClick={() => setIsRoundTrip(true)}
          className="flex-1 bg-red"
        >
          Round Trip
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="origin">From</Label>
            <Popover open={originSearchOpen} onOpenChange={setOriginSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={originSearchOpen}
                  className="w-full bg-black justify-between"
                >
                  {origin ? origin : "Search for airports..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search airports..."
                    value={originSearchValue}
                    onValueChange={handleOriginSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No airports found.</CommandEmpty>
                    <CommandGroup>
                      {originAirports.map((airport) => (
                        <CommandItem
                          key={airport.iataCode}
                          onSelect={() => {
                            setOrigin(`${airport.name} (${airport.iataCode})`);
                            setOriginCode(airport.iataCode);
                            setOriginSearchOpen(false);
                          }}
                        >
                          <Plane className="mr-2 h-4 w-4" />
                          {airport.name} ({airport.iataCode})
                          <span className="ml-2 text-sm text-muted-foreground">
                            {airport.cityName}, {airport.countryName}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">To</Label>
            <Popover
              open={destinationSearchOpen}
              onOpenChange={setDestinationSearchOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={destinationSearchOpen}
                  className="w-full bg-black  justify-between"
                >
                  {destination ? destination : "Search for airports..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search airports..."
                    value={destinationSearchValue}
                    onValueChange={handleDestinationSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No airports found.</CommandEmpty>
                    <CommandGroup>
                      {destinationAirports.map((airport) => (
                        <CommandItem
                          key={airport.iataCode}
                          onSelect={() => {
                            setDestination(
                              `${airport.name} (${airport.iataCode})`
                            );
                            setDestinationCode(airport.iataCode);
                            setDestinationSearchOpen(false);
                          }}
                        >
                          <Plane className="mr-2 h-4 w-4" />
                          {airport.name} ({airport.iataCode})
                          <span className="ml-2 text-sm text-muted-foreground">
                            {airport.cityName}, {airport.countryName}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="departureDate">Departure Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-black justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? (
                    format(departureDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {isRoundTrip && (
            <div className="space-y-2">
              <Label htmlFor="returnDate">Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-black justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? (
                      format(returnDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    initialFocus
                    disabled={(date) => date < (departureDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="passengers">Passengers</Label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger id="passengers">
                <SelectValue
                  className="bg-black"
                  placeholder="Select passengers"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Passenger</SelectItem>
                <SelectItem value="2">2 Passengers</SelectItem>
                <SelectItem value="3">3 Passengers</SelectItem>
                <SelectItem value="4">4 Passengers</SelectItem>
                <SelectItem value="5">5 Passengers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cabinClass">Cabin Class</Label>
            <Select value={cabinClass} onValueChange={setCabinClass}>
              <SelectTrigger id="cabinClass">
                <SelectValue placeholder="Select cabin class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ECONOMY">Economy</SelectItem>
                <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="FIRST">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
          <Search className="mr-2 h-4 w-4" />
          Search Flights
        </Button>
      </form>
    </div>
  );
}
