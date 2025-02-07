# Flight Search Application

## Project Overview
A real-time flight search application built with React and TypeScript that enables users to search for flights across global airports. The application features an intuitive interface for searching flights with automated nearby airport suggestions and comprehensive flight details.

## Application Flow
1. **Airport Selection**
   - Users can search for origin and destination airports
   - Automatic suggestion of nearby airports based on user's geolocation
   - Real-time airport search with suggestions as users type

2. **Flight Parameters**
   - Date selection with validation for future dates
   - Passenger count selection (1-9 passengers)
   - Cabin class selection (Economy by default)

3. **Search Results**
   - Real-time flight availability check
   - Display of comprehensive flight details including:
     - Pricing information
     - Flight duration
     - Stopover details
     - Airline information
   - Pagination for multiple results

## Third-Party Integration
The application integrates with the Sky-Scrapper API from RapidAPI for:
- Real-time flight data access
- Global airport database
- Geolocation-based airport suggestions
- Live pricing information
- Comprehensive flight details

## Technical Stack
1. **Frontend Framework**
   - React (with TypeScript) for robust component architecture
   - Tailwind CSS for responsive design
   - Lucide Icons for consistent UI elements

2. **State Management**
   - React Hooks for local state management
   - Custom hooks for API integration

3. **API Integration**
   - Fetch API for HTTP requests
   - RapidAPI for flight data
   - Geolocation API for user location

## System Requirements
- Node.js: v18.20.6
- npm: v10.8.2

## Installation Guide

### Clone Repository
```bash
git clone https://github.com/tayyab95-12/spotter_frontend
cd spotter_frontend
```

### Install Dependencies
```bash
npm install
```

### Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_RAPID_API_KEY=your_api_key_here
VITE_RAPID_API_HOST=sky-scrapper.p.rapidapi.com
```

### Development Server
```bash
npm run dev
```
Access the application at `http://localhost:5173`

## Technical Features
1. **Geolocation Integration**
   - Automatic nearby airport detection
   - Location-based suggestions

2. **Real-time Search**
   - Debounced airport search
   - Dynamic result updates

3. **Error Handling**
   - API error management
   - User input validation
   - Fallback states for failed requests

4. **Responsive Design**
   - Mobile-first approach
   - Adaptive layout for all screen sizes
   - Touch-friendly interface

5. **Performance Optimization**
   - Lazy loading of results
   - Debounced search
   - Optimized re-renders