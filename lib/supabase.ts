import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          wallet_balance: number
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          wallet_balance?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          wallet_balance?: number
          created_at?: string
        }
      }
      bookings: {
        Row: {
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
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          flight_id: string
          booking_reference: string
          passenger_name: string
          passenger_email: string
          amount_paid: number
          booking_date: string
          travel_date: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          flight_id?: string
          booking_reference?: string
          passenger_name?: string
          passenger_email?: string
          amount_paid?: number
          booking_date?: string
          travel_date?: string
          status?: string
          created_at?: string
        }
      }
      flights: {
        Row: {
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
          created_at: string
        }
        Insert: {
          id?: string
          flight_number: string
          airline: string
          departure_airport: string
          arrival_airport: string
          departure_time: string
          arrival_time: string
          base_price: number
          current_price: number
          available_seats: number
          created_at?: string
        }
        Update: {
          id?: string
          flight_number?: string
          airline?: string
          departure_airport?: string
          arrival_airport?: string
          departure_time?: string
          arrival_time?: string
          base_price?: number
          current_price?: number
          available_seats?: number
          created_at?: string
        }
      }
      search_history: {
        Row: {
          id: string
          user_id: string
          flight_id: string
          search_count: number
          last_search_time: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          flight_id: string
          search_count: number
          last_search_time: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          flight_id?: string
          search_count?: number
          last_search_time?: string
          created_at?: string
        }
      }
    }
  }
}
