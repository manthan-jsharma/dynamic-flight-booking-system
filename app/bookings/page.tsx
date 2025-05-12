"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserBookings } from "@/app/actions/flight-actions"
import { generateTicketPDF } from "@/lib/pdf-generator"
import { ArrowRight, Download, Plane } from "lucide-react"

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock user ID for demo purposes
  const userId = "user-123"

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const results = await getUserBookings(userId)
        setBookings(results)
      } catch (err: any) {
        console.error("Error fetching bookings:", err)
        setError(err.message || "Failed to fetch bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [userId])

  const handleDownloadTicket = (booking: any) => {
    const doc = generateTicketPDF(booking, booking.flights, booking.passenger_name)
    doc.save(`ticket-${booking.booking_reference}.pdf`)
  }

  const getUpcomingBookings = () => {
    return bookings.filter((booking) => {
      const travelDate = new Date(booking.travel_date)
      return travelDate >= new Date()
    })
  }

  const getPastBookings = () => {
    return bookings.filter((booking) => {
      const travelDate = new Date(booking.travel_date)
      return travelDate < new Date()
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        {error ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">You don't have any bookings yet.</p>
            <Button onClick={() => router.push("/")} className="mt-4 bg-rose-600 hover:bg-rose-700">
              Book a Flight
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {getUpcomingBookings().length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">You don't have any upcoming bookings.</p>
                  <Button onClick={() => router.push("/")} className="mt-4 bg-rose-600 hover:bg-rose-700">
                    Book a Flight
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {getUpcomingBookings().map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onDownload={() => handleDownloadTicket(booking)}
                      onViewDetails={() => router.push(`/booking-confirmation/${booking.id}`)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {getPastBookings().length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">You don't have any past bookings.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getPastBookings().map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onDownload={() => handleDownloadTicket(booking)}
                      onViewDetails={() => router.push(`/booking-confirmation/${booking.id}`)}
                      isPast
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all">
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onDownload={() => handleDownloadTicket(booking)}
                    onViewDetails={() => router.push(`/booking-confirmation/${booking.id}`)}
                    isPast={new Date(booking.travel_date) < new Date()}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2025 Dynamic Flight System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface BookingCardProps {
  booking: any
  onDownload: () => void
  onViewDetails: () => void
  isPast?: boolean
}

function BookingCard({ booking, onDownload, onViewDetails, isPast = false }: BookingCardProps) {
  const flight = booking.flights
  const departureDateTime = new Date(flight.departure_time)
  const arrivalDateTime = new Date(flight.arrival_time)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              <Plane className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center">
                <p className="font-semibold">
                  {flight.airline} {flight.flight_number}
                </p>
                {isPast && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">Completed</span>
                )}
                {!isPast && (
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Upcoming</span>
                )}
              </div>
              <p className="text-sm text-gray-500">Booking Ref: {booking.booking_reference}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto">
            <div className="text-center">
              <p className="text-sm text-gray-500">From</p>
              <p className="font-semibold">{flight.departure_airport}</p>
              <p className="text-sm">{departureDateTime.toLocaleDateString()}</p>
            </div>

            <div className="hidden md:block">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">To</p>
              <p className="font-semibold">{flight.arrival_airport}</p>
              <p className="text-sm">{arrivalDateTime.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              Ticket
            </Button>
            <Button size="sm" onClick={onViewDetails} className="bg-rose-600 hover:bg-rose-700">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
