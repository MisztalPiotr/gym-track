import { Set } from './set.model';


export interface Exercise {
   name: string;
  sets: Set[];
  notes?: string; // opcjonalne dodatkowe informacje
  }