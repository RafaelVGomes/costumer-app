import routingClient from './google-maps-client';

// Define the RouteRequest and RouteResponse interfaces
interface RouteRequest {
  origin: {
    location: {
      latLng: {
        latitude: number;
        longitude: number;
      };
    };
  };
  destination: {
    location: {
      latLng: {
        latitude: number;
        longitude: number;
      };
    };
  };
}

interface RouteResponse {
  distance: number; // Distance in meters
  duration: string; // Duration as a human-readable string
  polyline: string; // Encoded polyline
}

// Fetches route details from Google Maps API
export async function getRoute(request: RouteRequest): Promise<RouteResponse> {
  try {
    const [response] = await routingClient.computeRoutes(request, {
      otherArgs: {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY || '',
          'X-Goog-FieldMask':
            'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
        },
      },
    });

    const route = response.routes?.[0];

    if (!route) {
      throw new Error('No route found.');
    }

    return {
      distance: route.distanceMeters || 0, // Ensure distance is present
      duration: `${route.duration?.seconds || 0} segundos`, // Convert duration to string
      polyline: route.polyline?.encodedPolyline || '', // Ensure polyline is present
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    throw new Error('Failed to fetch route.');
  }
}
