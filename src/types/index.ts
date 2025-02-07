export interface Airport {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
  navigation: {
    relevantFlightParams: {
      skyId: string;
      entityId: string;
    };
  };
}

export interface SearchResult {
  status: boolean;
  timestamp: number;
  data: {
    current: Airport;
    nearby: Airport[];
    recent: Airport[];
  };
}

export interface FlightSearchParams {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  returnDate?: string;
  adults?: number;
  cabinClass?: string;
  sortBy?: string;
}


export interface FlightResult {
  id: string;
  price: {
    raw: number;
    formatted: string;
  };
  legs: {
    id: string;
    origin: {
      id: string;
      name: string;
      displayCode: string;
      city: string;
      country: string;
    };
    destination: {
      id: string;
      name: string;
      displayCode: string;
      city: string;
      country: string;
    };
    durationInMinutes: number;
    stopCount: number;
    departure: string;
    arrival: string;
    carriers: {
      marketing: Array<{
        id: number;
        name: string;
        logoUrl: string;
      }>;
    };
  }[];
}