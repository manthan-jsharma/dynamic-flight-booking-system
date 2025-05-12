export async function getAmadeusToken() {
  try {
    const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.NEXT_PUBLIC_AMADEUS_API_KEY!,
        client_secret: process.env.NEXT_PUBLIC_AMADEUS_API_SECRET!,
      }),
    })

    if (!res.ok) {
      throw new Error(`Failed to get Amadeus token: ${res.status}`)
    }

    const data = await res.json()
    return data.access_token
  } catch (error) {
    console.error("Error getting Amadeus token:", error)
    throw error
  }
}

export async function searchAirports(query: string) {
  try {
    const token = await getAmadeusToken()
    const params = new URLSearchParams({
      subType: "AIRPORT",
      keyword: query,
      "page[limit]": "10",
    })

    const response = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to search airports: ${response.status}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error searching airports:", error)
    throw error
  }
}

export async function searchFlights(
  originLocationCode: string,
  destinationLocationCode: string,
  departureDate: string,
  adults = 1,
  returnDate?: string,
) {
  try {
    const token = await getAmadeusToken()

    const params = new URLSearchParams({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults: adults.toString(),
      currencyCode: "INR",
      max: "10",
    })

    if (returnDate) {
      params.append("returnDate", returnDate)
    }

    const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to search flights: ${response.status}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error searching flights:", error)
    throw error
  }
}
