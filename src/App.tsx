import React, { useState } from 'react';
import { Plane } from 'lucide-react';
import SearchForm from './components/SearchForm';
import { FlightSearchParams } from './types';
import { flightService } from './services/api';

interface FlightResult {
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

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<FlightResult[] | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const handleSearch = async (params: FlightSearchParams) => {
    setIsLoading(true);
    setError(null);
    setSearchResults(null);
    setSearchPerformed(true);
    setCurrentPage(1); // Reset to first page on new search
    console.log("Here is the params of handleSearch    :::::::::::         ",params);
    try {
      const results = await flightService.searchFlights(params);
      console.log("Here is the results of handleSearch    :::::::::::         ",results);
      setSearchResults(results.data.itineraries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching for flights');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPageResults = () => {
    if (!searchResults) return [];
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return searchResults.slice(startIndex, endIndex);
  };

  const totalPages = searchResults ? Math.ceil(searchResults.length / resultsPerPage) : 0;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SkySearch</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Flight</h2>
          <p className="text-lg text-gray-600">Search hundreds of airlines and find the best deals</p>
        </div>

        {/* Search Form */}
        <SearchForm onSearch={handleSearch} />

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Searching for the best flights...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults && searchResults.length > 0 ? (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Available Flights</h3>
              <p className="text-gray-600">
                Showing {((currentPage - 1) * resultsPerPage) + 1}-
                {Math.min(currentPage * resultsPerPage, searchResults.length)} of {searchResults.length} flights
              </p>
            </div>

            {getCurrentPageResults().map((flight) => (
              <div
                key={flight.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={flight.legs[0].carriers.marketing[0].logoUrl} 
                        alt={flight.legs[0].carriers.marketing[0].name}
                        className="h-6 w-6"
                      />
                      <h4 className="font-semibold text-lg">{flight.legs[0].carriers.marketing[0].name}</h4>
                    </div>
                    <div className="text-gray-600">
                      <p>
                        {flight.legs[0].origin.city} ({flight.legs[0].origin.displayCode}) →{' '}
                        {flight.legs[0].destination.city} ({flight.legs[0].destination.displayCode})
                      </p>
                      <p>Departure: {new Date(flight.legs[0].departure).toLocaleString()}</p>
                      <p>Arrival: {new Date(flight.legs[0].arrival).toLocaleString()}</p>
                      <p>Duration: {Math.floor(flight.legs[0].durationInMinutes / 60)}h {flight.legs[0].durationInMinutes % 60}m</p>
                      <p>Stops: {flight.legs[0].stopCount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{flight.price.formatted}</p>
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  } border border-gray-300`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-600 hover:bg-blue-50'
                        } border border-gray-300`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="px-4 py-2 text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  } border border-gray-300`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : searchPerformed && !isLoading ? (
          <div className="mt-8 text-center py-8">
            <p className="text-gray-600">No flights found for your search criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search parameters.</p>
          </div>
        ) : null}

        {/* Features Section */}
        {!searchPerformed && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Best Prices</h3>
              <p className="text-gray-600">
                Compare prices from multiple airlines to find the best deals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Real-Time Updates</h3>
              <p className="text-gray-600">
                Get live updates on flight prices and availability.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Global Coverage</h3>
              <p className="text-gray-600">
                Search flights to and from airports worldwide.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 mt-auto bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} SkySearch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;