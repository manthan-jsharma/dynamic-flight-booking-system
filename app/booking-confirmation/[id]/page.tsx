"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import { generateTicketPDF } from "@/lib/pdf-generator"
import { ArrowLeft, Check, Download, Plane, Printer } from "lucide-react"

export default function BookingConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [flight, setFlight] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            flights (*)
          `)
          .eq("id", params.id)
          .single()

        if (error) throw error

        setBooking(data)
        setFlight(data.flights)
      } catch (err: any) {
        console.error("Error fetching booking details:", err)
        setError(err.message || "Failed to fetch booking details")
      } finally {
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [params.id])

  const handleDownloadTicket = () => {
    if (!booking || !flight) return

    const doc = generateTicketPDF(booking, flight, booking.passenger_name)
    doc.save(`ticket-${booking.booking_reference}.pdf`)
  }

  const handlePrintTicket = () => {
    if (!booking || !flight) return

    const doc = generateTicketPDF(booking, flight, booking.passenger_name)
    doc.autoPrint()
    doc.output("dataurlnewwindow")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 text-center">
            <p className="text-red-500">{error || "Booking not found"}</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Return to Home
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const departureDateTime = new Date(flight.departure_time)
  const arrivalDateTime = new Date(flight.arrival_time)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/bookings")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          View All Bookings
        </Button>

        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="bg-green-50 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-green-700">Booking Confirmed!</CardTitle>
                  <CardDescription>
                    Your booking reference is <span className="font-bold">{booking.booking_reference}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Flight Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                        <Plane className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{flight.airline}</p>
                        <p className="text-sm text-gray-500">{flight.flight_number}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="font-semibold">{flight.departure_airport}</p>
                        <p>{departureDateTime.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Arrival</p>
                        <p className="font-semibold">{flight.arrival_airport}</p>
                        <p>{arrivalDateTime.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Passenger Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold">{booking.passenger_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold">{booking.passenger_email}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Amount Paid</p>
                      <p className="font-semibold">₹{booking.amount_paid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Date</p>
                      <p className="font-semibold">{new Date(booking.booking_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handlePrintTicket}>
                <Printer className="mr-2 h-4 w-4" />
                Print Ticket
              </Button>
              <Button onClick={handleDownloadTicket} className="bg-rose-600 hover:bg-rose-700">
                <Download className="mr-2 h-4 w-4" />
                Download Ticket
              </Button>
            </CardFooter>
          </Card>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Please arrive at the airport at least 2 hours before your scheduled departure
              time. Don't forget to bring a valid ID for check-in.
            </p>
          </div>
        </div>
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
