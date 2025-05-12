"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import type { FlightOffer } from "@/types"

interface FlightFiltersProps {
  flights: FlightOffer[]
  onFilterChange: (filtered: FlightOffer[]) => void
}

export default function FlightFilters({ flights, onFilterChange }: FlightFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [selectedStops, setSelectedStops] = useState<number[]>([])

  // Get unique airlines
  const airlines = Array.from(new Set(flights.map((flight) => flight.airline)))

  // Get min and max price
  const minPrice = Math.min(...flights.map((flight) => flight.price))
  const maxPrice = Math.max(...flights.map((flight) => flight.price))

  // Initialize price range
  useState(() => {
    setPriceRange([minPrice, maxPrice])
  })

  const applyFilters = () => {
    let filtered = [...flights]

    // Filter by price
    filtered = filtered.filter((flight) => flight.price >= priceRange[0] && flight.price <= priceRange[1])

    // Filter by airline
    if (selectedAirlines.length > 0) {
      filtered = filtered.filter((flight) => selectedAirlines.includes(flight.airline))
    }

    // Filter by stops
    if (selectedStops.length > 0) {
      filtered = filtered.filter((flight) => selectedStops.includes(flight.stops))
    }

    onFilterChange(filtered)
  }

  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airline])
    } else {
      setSelectedAirlines(selectedAirlines.filter((a) => a !== airline))
    }
  }

  const handleStopsChange = (stops: number, checked: boolean) => {
    if (checked) {
      setSelectedStops([...selectedStops, stops])
    } else {
      setSelectedStops(selectedStops.filter((s) => s !== stops))
    }
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice])
    setSelectedAirlines([])
    setSelectedStops([])
    onFilterChange(flights)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="py-4">
              <div className="flex justify-between mb-2">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
              <Slider
                defaultValue={[minPrice, maxPrice]}
                value={[priceRange[0], priceRange[1]]}
                min={minPrice}
                max={maxPrice}
                step={100}
                onValueChange={handlePriceChange}
                className="my-4"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="airlines">
          <AccordionTrigger>Airlines</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2">
              {airlines.map((airline) => (
                <div key={airline} className="flex items-center space-x-2">
                  <Checkbox
                    id={`airline-${airline}`}
                    checked={selectedAirlines.includes(airline)}
                    onCheckedChange={(checked) => handleAirlineChange(airline, checked as boolean)}
                  />
                  <Label htmlFor={`airline-${airline}`}>{airline}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stops">
          <AccordionTrigger>Stops</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 py-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stops-0"
                  checked={selectedStops.includes(0)}
                  onCheckedChange={(checked) => handleStopsChange(0, checked as boolean)}
                />
                <Label htmlFor="stops-0">Non-stop</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stops-1"
                  checked={selectedStops.includes(1)}
                  onCheckedChange={(checked) => handleStopsChange(1, checked as boolean)}
                />
                <Label htmlFor="stops-1">1 Stop</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stops-2"
                  checked={selectedStops.includes(2)}
                  onCheckedChange={(checked) => handleStopsChange(2, checked as boolean)}
                />
                <Label htmlFor="stops-2">2+ Stops</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-2 mt-6">
        <Button onClick={applyFilters} className="flex-1 bg-rose-600 hover:bg-rose-700">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={resetFilters} className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  )
}
