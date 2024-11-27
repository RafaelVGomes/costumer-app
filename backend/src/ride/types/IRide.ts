import { RouteApiResponse } from 'src/interfaces';

export interface RideEstimate<Drive> extends RouteApiResponse {
  options: Drive[];
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
