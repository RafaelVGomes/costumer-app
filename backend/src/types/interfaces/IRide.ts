import { RouteApiResponse } from 'src/types/interfaces';

export interface DriverCheckInfo {
  id: number;
  name: string;
  min_distance: number;
  rate_per_km: number;
}

export interface RideInfo {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string
  };
  value: number;
}

export interface RideEstimateRequest {
  customer_id: string;
  origin: string;
  destination: string;
}

export interface RideEstimateResponse<Driver> extends RouteApiResponse {
  options: Driver[];
}

export interface Driver {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    comment: string;
  };
  value: string;
}
