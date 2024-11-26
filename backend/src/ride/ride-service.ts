import { getRoute } from '../utils/google-maps-utils';
import { db } from '../database';
import logger from '../utils/logger';

/**
 * Service to calculate ride estimate using Google Maps API
 * @param startLocation Object containing latitude and longitude of start point
 * @param endLocation Object containing latitude and longitude of end point
 * @returns Ride estimate with distance, duration, and route polyline
 */
export const calculateRideEstimate = async (
  startLocation: { latitude: number; longitude: number },
  endLocation: { latitude: number; longitude: number }
): Promise<{ distance: number; duration: string; polyline: string }> => {
  try {
    // Build the request object for Google Maps API
    const request = {
      origin: {
        location: {
          latLng: {
            latitude: startLocation.latitude,
            longitude: startLocation.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: endLocation.latitude,
            longitude: endLocation.longitude,
          },
        },
      },
    };

    // Await the response from Google Maps API
    const result = await getRoute(request);
    logger.info('Route fetched successfully from Google Maps API', { result });
    return result;
  } catch (error) {
    logger.error('Error while fetching route from Google Maps API', { error });
    throw new Error('Failed to fetch route from Google Maps API.');
  }
};

export const confirmRideService = async (
  customerId: string,
  driverId: string,
  distance: number
): Promise<{
  id: string;
  customerId: string;
  driverId: string;
  distance: number;
  date: string;
}> => {
  try {
    const ride = {
      id: Math.random().toString(36).substr(2, 9), // Gerar ID temporário
      customerId,
      driverId,
      distance,
      date: new Date().toISOString(),
    };

    // Salvar no banco de dados
    await db('rides').insert(ride);

    return ride;
  } catch (error) {
    throw new Error('Failed to confirm ride.');
  }
};