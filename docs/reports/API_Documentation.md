# API Documentation

## API Version
Current Version: `v1`
Base Path: `/api/v1`

## Authentication
Currently, the API utilizes a unified API Key validation approach for backend service protection. Future iterations will introduce Firebase Authentication bearer tokens for user-specific endpoints.

## Endpoint Summary

### Core Endpoints

#### `GET /api/v1/health`
- **Description**: Returns the health status of the application and all connected external providers (Gemini, Google Maps, Firebase).
- **Response Model**: `HealthResponse`

---

### Crowd AI Endpoints (`/api/v1/crowd`)

#### `GET /api/v1/crowd/heatmap`
- **Description**: Retrieves the real-time crowd density heatmap for the venue.
- **Response Model**: `HeatmapResponse`

#### `POST /api/v1/crowd/predict`
- **Description**: Uses Gemini AI to predict crowd flow from a starting zone to a target zone at a specified future time.
- **Request Model**: `PredictionRequest`
  - `current_zone` (str): Origin zone
  - `target_zone` (str): Destination zone
  - `time_offset_minutes` (int): Minutes into the future
- **Response Model**: `PredictionResponse`

---

### Smart Navigation Endpoints (`/api/v1/navigation`)

#### `POST /api/v1/navigation/venue`
- **Description**: Provides accessible, turn-by-turn walking navigation within the venue.
- **Request Model**: `VenueNavigationRequest`
  - `origin` (str): Starting location
  - `destination_name` (str): Target location name
  - `destination_category` (Optional[str]): E.g., 'restroom', 'food'
- **Response Model**: `VenueNavigationResponse`

#### `POST /api/v1/navigation/transportation`
- **Description**: Recommends the optimal transportation mode based on live crowd data and user context using Gemini AI.
- **Request Model**: `TransportationRequest`
  - `origin` (str)
  - `destination` (str)
  - `context` (str): E.g., 'family with stroller'
- **Response Model**: `TransportationResponse`

---

### Sustainability Endpoints (`/api/v1/sustainability`)

#### `POST /api/v1/sustainability/green-route`
- **Description**: Suggests eco-friendly transit routes and calculates the CO2 emissions saved.
- **Request Model**: `GreenRouteRequest`
  - `origin` (str)
  - `destination` (str)
- **Response Model**: `GreenRouteResponse`

#### `GET /api/v1/sustainability/facilities`
- **Description**: Locates the nearest water refill stations and recycling bins for a given zone.
- **Query Params**: `location` (str)
- **Response Model**: `FacilityResponse`

## Shared API Envelopes & Error Formatting
All successful responses directly return the domain-specific Response Models defined above. 

**Error Response Format**:
```json
{
  "detail": "Error description string detailing the failure reason."
}
```
HTTP Status Codes:
- `200 OK`: Successful operation.
- `400 Bad Request`: Validation failure.
- `500 Internal Server Error`: Unhandled exception or external provider failure.
- `503 Service Unavailable`: External API (Gemini/Maps) failure after retries.
