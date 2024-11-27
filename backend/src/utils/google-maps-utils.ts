import { RoutesClient } from '@googlemaps/routing';
import { RouteApiRequest, RouteApiResponse } from 'src/types/interfaces';
import { secondsToMinutes } from './time-converter';

const routingClient = new RoutesClient();

// Fetches route details from Google Maps API
export async function getRoute(request: RouteApiRequest): Promise<RouteApiResponse> {
  try {
    const [response] = await routingClient.computeRoutes(request, {
      otherArgs: {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY || '',
          'X-Goog-FieldMask':
            'routes.duration,routes.distanceMeters,routes.legs.startLocation,routes.legs.endLocation', // routes.polyline.encodedPolyline
        },
      },
    });
    
    const route = response.routes?.[0];
    const origin = response.routes?.[0].legs?.[0].startLocation?.latLng;
    const destination = response.routes?.[0].legs?.[0].endLocation?.latLng;
    

    if (!route) {
      throw new Error('No route found.');
    }

    return {
      origin: {
        latitude: origin?.latitude || 0,
        longitude: origin?.longitude || 0,
      },
      destination: {
        latitude: destination?.latitude || 0,
        longitude: destination?.longitude || 0,
      },
      distance: route.distanceMeters || 0,
      duration: secondsToMinutes(Number(route.duration?.seconds)) || '0',
      routeResponse: route || {},
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    throw new Error('Failed to fetch route.');
  }
}
