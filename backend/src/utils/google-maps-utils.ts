import routingClient from './google-maps-client';

// Tipagem para entrada
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

// Tipagem para a saída formatada
interface RouteResponse {
  duration: string;
  distanceMeters: number;
  polyline: string;
}

export async function getRoute(request: RouteRequest): Promise<RouteResponse> {
  try {
    // Faz a chamada para a API Routes
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

    // Extrai os dados relevantes da resposta
    const route = response.routes?.[0];

    if (!route) {
      throw new Error('Nenhuma rota encontrada.');
    }

    const duration =
      typeof route.duration === 'string'
        ? route.duration
        : `${route.duration?.seconds || 0} segundos`;

    return {
      duration,
      distanceMeters: route.distanceMeters || 0,
      polyline: route.polyline?.encodedPolyline || '',
    };
  } catch (error) {
    console.error('Erro ao calcular a rota:', error);
    throw new Error('Não foi possível calcular a rota.');
  }
}
