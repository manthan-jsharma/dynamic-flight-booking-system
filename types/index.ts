export interface User {
  id: string
  email: string
  name: string
  wallet_balance: number
}

export interface Flight {
  id: string
  flight_number: string
  airline: string
  departure_airport: string
  arrival_airport: string
  departure_time: string
  arrival_time: string
  base_price: number
  current_price: number
  available_seats: number
}

export interface Booking {
  id: string
  user_id: string
  flight_id: string
  booking_reference: string
  passenger_name: string
  passenger_email: string
  amount_paid: number
  booking_date: string
  travel_date: string
  status: string
}

export interface Airport {
  iataCode: string
  name: string
  cityName: string
  countryName: string
}

export interface FlightOffer {
  id: string
  source: {
    iataCode: string
    name: string
    cityName: string
  }
  destination: {
    iataCode: string
    name: string
    cityName: string
  }
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  duration: string
  airline: string
  flightNumber: string
  price: number
  originalPrice: number
  cabinClass: string
  stops: number
}

export interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass: string
}
