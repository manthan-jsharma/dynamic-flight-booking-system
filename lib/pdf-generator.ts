import { jsPDF } from "jspdf"
import "jspdf-autotable"
import type { Booking, Flight } from "@/types"

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export function generateTicketPDF(booking: Booking, flight: Flight, userName: string) {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("Flight Ticket", 105, 20, { align: "center" })

  // Add logo placeholder
  doc.setFontSize(12)
  doc.setTextColor(80, 80, 80)
  doc.text("Dynamic Flight System", 105, 30, { align: "center" })

  // Add booking reference
  doc.setFontSize(16)
  doc.setTextColor(40, 40, 40)
  doc.text(`Booking Reference: ${booking.booking_reference}`, 105, 40, { align: "center" })

  // Add passenger info
  doc.setFontSize(12)
  doc.text(`Passenger: ${booking.passenger_name}`, 20, 60)
  doc.text(`Email: ${booking.passenger_email}`, 20, 70)

  // Add flight info
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Flight Details", 20, 90)

  doc.setFontSize(12)
  doc.text(`Flight: ${flight.airline} ${flight.flight_number}`, 20, 100)
  doc.text(`From: ${flight.departure_airport}`, 20, 110)
  doc.text(`To: ${flight.arrival_airport}`, 20, 120)

  const departureDateTime = new Date(flight.departure_time)
  const arrivalDateTime = new Date(flight.arrival_time)

  doc.text(`Departure: ${departureDateTime.toLocaleString()}`, 20, 130)
  doc.text(`Arrival: ${arrivalDateTime.toLocaleString()}`, 20, 140)

  // Add payment info
  doc.setFontSize(14)
  doc.text("Payment Details", 20, 160)

  doc.setFontSize(12)
  doc.text(`Amount Paid: ₹${booking.amount_paid.toFixed(2)}`, 20, 170)
  doc.text(`Payment Date: ${new Date(booking.booking_date).toLocaleDateString()}`, 20, 180)

  // Add barcode placeholder
  doc.setFontSize(10)
  doc.text("Scan the barcode at the airport for check-in", 105, 200, { align: "center" })
  doc.rect(65, 210, 80, 20)
  doc.setFontSize(8)
  doc.text(booking.booking_reference, 105, 223, { align: "center" })

  // Add footer
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text("Thank you for choosing Dynamic Flight System", 105, 250, { align: "center" })
  doc.text("This is an electronic ticket. Please print or save this document.", 105, 260, { align: "center" })

  return doc
}
