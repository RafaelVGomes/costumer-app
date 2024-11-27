export interface RouteApiRequest {
  origin: {
    address: string;
  };
  destination: {
    address: string;
  };
}

export interface RouteApiResponse {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  routeResponse: object;
}
