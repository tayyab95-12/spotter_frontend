import React, { useState, useEffect } from 'react';
import { Plane, Calendar, Users } from 'lucide-react';
import { flightService } from '../services/api';
import { Airport, FlightSearchParams } from '../types';

interface SearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [originAirport, setOriginAirport] = useState<Airport | null>(null);
  const [destinationAirport, setDestinationAirport] = useState<Airport | null>(null);
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  // const [isLoadingNearby, setIsLoadingNearby] = useState(false);

  useEffect(() => {
    const searchAirports = async () => {
      if (originQuery.length >= 2) {
        console.log("Here is the originQuery   ABC :::::::::::         ",originQuery);
        const results = await flightService.searchAirports(originQuery);
        console.log("Here is the results of searchAirports    :::::::::::         ",results);
        setOriginSuggestions(results);
        setShowOriginSuggestions(true);
      } else {
        setOriginSuggestions([]);
        setShowOriginSuggestions(false);
      }
    };
    const timeoutId = setTimeout(searchAirports, 300);
    return () => clearTimeout(timeoutId);
  }, [originQuery]);

  // Add this useEffect after your other useEffects
  useEffect(() => {
    const getNearbyAirports = async () => {
      if (originQuery.length === 0) {
        try {
          const nearbyAirports = await flightService.getNearbyAirportsFromCurrentLocation();
          const mappedAirports = nearbyAirports.map(airport => ({
            skyId: airport.navigation.relevantFlightParams.skyId,
            entityId: airport.navigation.relevantFlightParams.entityId,
            presentation: {
              title: airport.presentation.title,
              // suggestionTitle: `${airport.presentation.title} (${airport.navigation.relevantFlightParams.skyId})`,
              suggestionTitle: `${airport.presentation.title}`,
              subtitle: airport.presentation.subtitle
            }
          }));
          
          setOriginSuggestions(mappedAirports as Airport[]);
          setShowOriginSuggestions(true);
        } catch (error) {
          console.error('Error getting nearby airports:', error);
          setOriginSuggestions([]);
        }
      }
    };
  
    getNearbyAirports();
  }, [originQuery]); 

  useEffect(() => {
    const searchAirports = async () => {
      if (destinationQuery.length >= 2) {
        const results = await flightService.searchAirports(destinationQuery);
        setDestinationSuggestions(results);
        setShowDestinationSuggestions(true);
      } else {
        setDestinationSuggestions([]);
        setShowDestinationSuggestions(false);
      }
    };
    const timeoutId = setTimeout(searchAirports, 300);
    return () => clearTimeout(timeoutId);
  }, [destinationQuery]);

  const handleOriginSelect = (airport: Airport) => {
    console.log("Here is the HANDLERRR origin airport airport  ABC  :::::::::::         ",airport);
    setOriginAirport(airport);
    setOriginQuery(airport.presentation.title);
    setShowOriginSuggestions(false);
  };

  const handleDestinationSelect = (airport: Airport) => {
    setDestinationAirport(airport);
    setDestinationQuery(airport.presentation.title);
    setShowDestinationSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Here is the handleSubmit  ABC  :::::::::::         ",originAirport);
    e.preventDefault();
    if (!originAirport || !destinationAirport || !date) {
    // if (!destinationAirport || !date) {
      alert('Please fill in all required fields');
      return;
    }
    // if (!originAirport) {
    //   try {
    //     setIsLoadingNearby(true);
    //     const nearbyAirports = await flightService.getNearbyAirportsFromCurrentLocation();
    //     // console.log("Here is the nearbyAirports  XYZ  :::::::::::       ",nearbyAirports);
    //     if (nearbyAirports && nearbyAirports.length > 0) {
    //       const nearestAirport = nearbyAirports[0];
    //       console.log("Get fields one by one :::::::::::       ",nearestAirport);
    //     //   const newAirport = {
    //     //     "skyId": nearestAirport.skyId,
    //     //     "entityId":nearestAirport.entityId,
    //     //     "presentation":{
    //     //        "title":nearestAirport.presentation.title,
    //     //        "suggestionTitle":nearestAirport.presentation.title,
    //     //        "subtitle":nearestAirport.presentation.subtitle
    //     //     },
    //     //     "navigation":{
    //     //        "entityId":nearestAirport.entityId,
    //     //        "entityType":"CITY",
    //     //        "localizedName":nearestAirport.presentation.title,
    //     //        "relevantFlightParams":{
    //     //           "skyId":nearestAirport.skyId,
    //     //           "entityId":nearestAirport.entityId,
    //     //           "flightPlaceType":"CITY",
    //     //           "localizedName":nearestAirport.presentation.title
    //     //        },
    //     //        "relevantHotelParams":{
    //     //           "entityId":nearestAirport.entityId,
    //     //           "entityType":"CITY",
    //     //           "localizedName":nearestAirport.presentation.title
    //     //        }
    //     //     }
    //     //  }

    //     const newAirport = {
    //       skyId: nearestAirport.navigation.relevantFlightParams.skyId,
    //       entityId: nearestAirport.navigation.relevantFlightParams.entityId,
    //       presentation: {
    //         title: nearestAirport.presentation.title,
    //         suggestionTitle: nearestAirport.presentation.title,
    //         subtitle: nearestAirport.presentation.subtitle,
    //       },
    //     };
    //       // setOriginAirport(newAirport);
    //       // setOriginQuery(nearestAirport.presentation.subtitle);
    //       console.log("Here is the newAirport  XYZ  :::::::::::       ",newAirport);
    //       // handleOriginSelect(newAirport);
    //       setOriginSuggestions
    //     } else {
    //       alert('No nearby airports found. Please enter origin city manually.');
    //       return;
    //     }
    //   } catch (error) {
    //     console.error('Error getting nearby airports:', error);
    //     alert('Unable to get nearby airports. Please enter origin city manually.');
    //     return;
    //   } finally {
    //     setIsLoadingNearby(false);
    //   }
      
    //   // const params: FlightSearchParams = {
    //   //   originSkyId: originAirport?.skyId || '',
    //   //   destinationSkyId: destinationAirport?.skyId,
    //   //   originEntityId: originAirport?.entityId || '',
    //   //   destinationEntityId: destinationAirport?.entityId,
    //   //   date,
    //   //   adults: passengers,
    //   // };
    //   // onSearch(params);
    // }
    // else {
      const params: FlightSearchParams = {
        originSkyId: originAirport?.skyId || '',
        destinationSkyId: destinationAirport?.skyId,
        originEntityId: originAirport?.entityId || '',
        destinationEntityId: destinationAirport?.entityId,
        date,
        adults: passengers,
      };

      console.log("Here is the originAirport ********************** :::::::::::       ",originAirport);
      onSearch(params);
    // }
  };

  return (
    <div className="flex justify-center w-full">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Origin Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="relative">
              <Plane className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={originQuery}
                onChange={(e) => setOriginQuery(e.target.value)}
                onFocus={() => setShowOriginSuggestions(true)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Origin city"
              />
              {showOriginSuggestions && originSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {originSuggestions.map((airport) => (
                    <div
                      key={airport.skyId}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleOriginSelect(airport)}
                    >
                      <div className="font-medium">{airport.presentation.suggestionTitle}</div>
                      <div className="text-sm text-gray-500">{airport.presentation.subtitle}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Destination Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="relative">
              <Plane className="absolute left-3 top-3 h-5 w-5 text-gray-400 transform rotate-90" />
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                onFocus={() => setShowDestinationSuggestions(true)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Destination city"
              />
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {destinationSuggestions.map((airport) => (
                    <div
                      key={airport.skyId}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDestinationSelect(airport)}
                    >
                      <div className="font-medium">{airport.presentation.suggestionTitle}</div>
                      <div className="text-sm text-gray-500">{airport.presentation.subtitle}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Passengers Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                min="1"
                max="9"
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Search Flights
          </button>
        </div>

        {/* Click outside handler for suggestions */}
        {(showOriginSuggestions || showDestinationSuggestions) && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => {
              setShowOriginSuggestions(false);
              setShowDestinationSuggestions(false);
            }}
          />
        )}
      </form>
    </div>
  );
}