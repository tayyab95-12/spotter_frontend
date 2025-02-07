import { FlightSearchParams, Airport } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const headers = {
  'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
  'X-RapidAPI-Host': import.meta.env.VITE_API_HOST,
  'Content-Type': 'application/json',
};

export const flightService = {
  async searchAirports(query: string): Promise<Airport[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/searchAirport?query=${encodeURIComponent(query)}&locale=en-US`,
        { headers }
      );

      if ( ! response.ok) {
        throw new Error('Failed to fetch airports');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error searching airports:', error);
      throw error;
    }
  },


  // Helper method to get nearby airports using current location
  async getNearbyAirportsFromCurrentLocation(): Promise<Airport[]> {
    try {
      const position = await this.getCurrentLocation();
      const { latitude, longitude } = position.coords;
      return await this.getNearbyAirports(latitude, longitude);
    } catch (error) {
      console.error('Error getting nearby airports from current location:', error);
      throw error;
    }
  },

  async getNearbyAirports(lat: number, lng: number): Promise<Airport[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/getNearByAirports?lat=${lat}&lng=${lng}&locale=en-US`,
        { headers }
      );
      if ( ! response.ok) {
        console.error('Failed to fetch nearby airports');
      }

      const data = await response.json();
      return data.data.nearby;
    } catch (error) {
      console.error('Error fetching nearby airports:', error);
      throw error;
    }
  },

  async searchFlights(params: FlightSearchParams): Promise<any> {
    try {
      const get_params = `?originSkyId=${params.originSkyId}&destinationSkyId=${params.destinationSkyId}&originEntityId=${params.originEntityId}&destinationEntityId=${params.destinationEntityId}&date=${params.date}&cabinClass=economy&adults=${params.adults}&sortBy=best&currency=USD&market=en-US&countryCode=US`
      const response = await fetch(`${API_BASE_URL}/searchFlights${get_params}`,
        { headers })

      if ( ! response.ok) {
        console.error('Failed to search flights');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  },


  async getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if ( ! navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  }
};