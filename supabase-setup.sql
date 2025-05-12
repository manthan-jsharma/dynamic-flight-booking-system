-- Create tables for the Dynamic Flight System

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  wallet_balance DECIMAL(10, 2) DEFAULT 50000.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flights table
CREATE TABLE flights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flight_number TEXT NOT NULL,
  airline TEXT NOT NULL,
  departure_airport TEXT NOT NULL,
  arrival_airport TEXT NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  current_price DECIMAL(10, 2) NOT NULL,
  available_seats INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  flight_id UUID NOT NULL REFERENCES flights(id),
  booking_reference TEXT NOT NULL UNIQUE,
  passenger_name TEXT NOT NULL,
  passenger_email TEXT NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  travel_date DATE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search history table for dynamic pricing
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  flight_id UUID NOT NULL REFERENCES flights(id),
  search_count INTEGER NOT NULL DEFAULT 1,
  last_search_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_flights_departure_arrival ON flights(departure_airport, arrival_airport);
CREATE INDEX idx_flights_departure_time ON flights(departure_time);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_flight_id ON bookings(flight_id);
CREATE INDEX idx_search_history_user_flight ON search_history(user_id, flight_id);

-- Insert a demo user
INSERT INTO users (email, name, wallet_balance)
VALUES ('demo@example.com', 'Demo User', 50000.00);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Anyone can read flights
CREATE POLICY "Anyone can read flights" ON flights
  FOR SELECT USING (true);
  -- Anyone (server-side or application) can insert flights (change this if you want more restrictions)
CREATE POLICY "Anyone can insert flights" ON flights
  FOR INSERT
  WITH CHECK (true);



-- Users can read their own bookings
CREATE POLICY "Users can read their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own bookings
CREATE POLICY "Users can create their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own search history
CREATE POLICY "Users can read their own search history" ON search_history
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own search history
CREATE POLICY "Users can create their own search history" ON search_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own search history
CREATE POLICY "Users can update their own search history" ON search_history
  FOR UPDATE USING (auth.uid() = user_id);
