"use server";

import { supabase } from "@/lib/supabase";
import { searchFlights } from "@/lib/amadeus";
import type { FlightOffer, SearchParams } from "@/types";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

// Function to transform Amadeus API response to our FlightOffer type
function transformFlightOffers(amadeusFlights: any[]): FlightOffer[] {
  return amadeusFlights.map((flight) => {
    const itinerary = flight.itineraries[0];
    const segment = itinerary.segments[0];
    const price = Number.parseFloat(flight.price.total);

    // Generate a random base price between 2000-3000 INR
    const basePrice = Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;

    return {
      id: flight.id,
      source: {
        iataCode: segment.departure.iataCode,
        name: segment.departure.iataCode,
        cityName: segment.departure.iataCode,
      },
      destination: {
        iataCode: segment.arrival.iataCode,
        name: segment.arrival.iataCode,
        cityName: segment.arrival.iataCode,
      },
      departureDate: segment.departure.at.split("T")[0],
      departureTime: segment.departure.at.split("T")[1],
      arrivalDate: segment.arrival.at.split("T")[0],
      arrivalTime: segment.arrival.at.split("T")[1],
      duration: itinerary.duration,
      airline: segment.carrierCode,
      flightNumber: `${segment.carrierCode}${segment.number}`,
      price: basePrice, // Use our random price
      originalPrice: basePrice, // Store original price for reference
      cabinClass: flight.travelerPricings[0].fareDetailsBySegment[0].cabin,
      stops: itinerary.segments.length - 1,
    };
  });
}

export async function searchFlightOffers(params: SearchParams) {
  try {
    const { origin, destination, departureDate, returnDate, passengers } =
      params;

    // Call Amadeus API
    const amadeusFlights = await searchFlights(
      origin,
      destination,
      departureDate,
      passengers,
      returnDate
    );

    // Transform the response
    const flightOffers = transformFlightOffers(amadeusFlights);

    const enrichedOffers: FlightOffer[] = [];

    for (const offer of flightOffers) {
      const departureTime = `${offer.departureDate}T${offer.departureTime}`;

      const { data: existingFlight } = await supabase
        .from("flights")
        .select("id")
        .eq("flight_number", offer.flightNumber)
        .eq("departure_time", departureTime)
        .single();

      let flightId: string;

      if (existingFlight) {
        flightId = existingFlight.id;
      } else {
        const insertResult = await supabase
          .from("flights")
          .insert({
            id: uuidv4(),
            flight_number: offer.flightNumber,
            airline: offer.airline,
            departure_airport: offer.source.iataCode,
            arrival_airport: offer.destination.iataCode,
            departure_time: departureTime,
            arrival_time: `${offer.arrivalDate}T${offer.arrivalTime}`,
            base_price: offer.originalPrice,
            current_price: offer.price,
            available_seats: Math.floor(Math.random() * 50) + 50,
          })
          .select("id")
          .single();

        flightId = insertResult.data?.id!;
      }

      enrichedOffers.push({
        ...offer,
        id: flightId, // ✅ Replace Amadeus ID with real UUID
      });
    }

    return enrichedOffers;
  } catch (error) {
    console.error("Error searching flight offers:", error);
    throw error;
  }
}

export async function getFlightDetails(flightId: string, userId: string) {
  try {
    // Get flight details from Supabase
    console.log("Flight ID:===================", flightId);

    const { data: flight } = await supabase
      .from("flights")
      .select("*")
      .eq("id", flightId)
      .single();
    console.log("Flight data:", flight);
    if (!flight) {
      throw new Error("Flight not found");
    }

    // Check search history for dynamic pricing
    const { data: searchHistory } = await supabase
      .from("search_history")
      .select("*")
      .eq("id", userId)
      .eq("flight_id", flightId)
      .single();

    let currentPrice = flight.base_price;
    let searchCount = 0;

    if (searchHistory) {
      searchCount = searchHistory.search_count + 1;
      const lastSearchTime = new Date(searchHistory.last_search_time);
      const currentTime = new Date();
      const timeDiff =
        (currentTime.getTime() - lastSearchTime.getTime()) / (1000 * 60); // in minutes

      // If searched 3 or more times within 5 minutes, increase price by 10%
      if (searchCount >= 3 && timeDiff <= 5) {
        currentPrice = flight.base_price * 1.1;
      } else if (timeDiff > 10) {
        // Reset search count after 10 minutes
        searchCount = 1;
      }

      // Update search history
      await supabase
        .from("search_history")
        .update({
          search_count: searchCount,
          last_search_time: new Date().toISOString(),
        })
        .eq("id", searchHistory.id);
    } else {
      // Create new search history
      await supabase.from("search_history").insert({
        id: uuidv4(),
        user_id: userId,
        flight_id: flightId,
        search_count: 1,
        last_search_time: new Date().toISOString(),
      });
    }

    // Update flight current price
    await supabase
      .from("flights")
      .update({ current_price: currentPrice })
      .eq("id", flightId);

    return {
      ...flight,
      current_price: currentPrice,
      search_count: searchCount,
    };
  } catch (error) {
    console.error("Error getting flight details:", error);
    throw error;
  }
}

export async function bookFlight(
  flightId: string,
  passengerName: string,
  passengerEmail: string
) {
  try {
    // ✅ Get flight details
    const { data: flight } = await supabase
      .from("flights")
      .select("*")
      .eq("id", flightId)
      .single();

    if (!flight) {
      throw new Error("Flight not found");
    }

    // ✅ Check if user exists by email
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", passengerEmail)
      .single();

    // ✅ If not, create user
    if (!user) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          id: uuidv4(),
          name: passengerName,
          email: passengerEmail,
          wallet_balance: 50000, // default balance
        })
        .select()
        .single();

      if (insertError || !newUser) {
        throw new Error("Failed to create user");
      }

      user = newUser;
    }

    // ✅ Check wallet balance
    if (user.wallet_balance < flight.current_price) {
      throw new Error("Insufficient wallet balance");
    }

    // ✅ Create booking
    const bookingReference = `BK${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`;
    const bookingId = uuidv4();

    await supabase.from("bookings").insert({
      id: bookingId,
      user_id: user.id,
      flight_id: flightId,
      booking_reference: bookingReference,
      passenger_name: passengerName,
      passenger_email: passengerEmail,
      amount_paid: flight.current_price,
      booking_date: new Date().toISOString(),
      travel_date: flight.departure_time.split("T")[0],
      status: "CONFIRMED",
    });

    // ✅ Update user wallet balance
    await supabase
      .from("users")
      .update({
        wallet_balance: user.wallet_balance - flight.current_price,
      })
      .eq("id", user.id);

    // ✅ Update flight available seats
    await supabase
      .from("flights")
      .update({
        available_seats: flight.available_seats - 1,
      })
      .eq("id", flightId);

    revalidatePath("/bookings");

    return {
      bookingId,
      bookingReference,
      flightDetails: flight,
      amountPaid: flight.current_price,
    };
  } catch (error) {
    console.error("Error booking flight:", error);
    throw error;
  }
}

export async function getUserBookings(userId: string) {
  try {
    const { data: bookings } = await supabase
      .from("bookings")
      .select(
        `
        *,
        flights (*)
      `
      )
      .eq("user_id", userId)
      .order("booking_date", { ascending: false });

    return bookings || [];
  } catch (error) {
    console.error("Error getting user bookings:", error);
    throw error;
  }
}
