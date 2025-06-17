import { TripInterface } from './TripInterface';
export interface TripsInterface {
  success: boolean;
  message?: string;
  trips?: TripInterface[];
  data?: any;
}
