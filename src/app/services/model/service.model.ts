import { Reservation } from './reservation.model';

export interface Service {
    title: string;
    description: string;
    reservations: Reservation[];
  }
 