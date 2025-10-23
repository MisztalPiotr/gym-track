import { Component, OnInit } from '@angular/core';
import { StudioService } from '../services/studio.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Reservation } from '../services/model/reservation.model';
import { Service } from '../services/model/service.model';
import { Studio } from '../services/model/studio.model';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'reservations',
    templateUrl: './reservation-confirm.component.html',
    styleUrls: ['./reservation-confirm.component.css']
})
export class ReservationConfirmComponent implements OnInit {
    user: firebase.default.User | null;
    reservations;
    studio;
    showConfirmed: boolean = true;
    filterState: string = 'all'; // 'all', 'waiting', 'true', 'false'

    // rest of your component code

 
    constructor(
        private studioService: StudioService,
        private authService: AuthService,
        public afAuth: AngularFireAuth
      ) {
        
          this.user = authService.user;
          this.studio = studioService.currentStudio;
      }

    ngOnInit(): void {     
    }

    setFilterState(state: string): void {
        this.filterState = state;
      }

    deleteReservation(studio : Studio, service: Service, reservation: Reservation){
      const serviceIndex = studio.service.findIndex(s => s.title === service.title);

      // If the service with the matching title is found
      if (serviceIndex !== -1) {
        // Access the found service
        const foundService = studio.service[serviceIndex];
    
        // Find the index of the reservation within the service based on the username
        const reservationIndex = foundService.reservations.findIndex(r => r.username === reservation.username &&
           r.startDate === r.startDate && reservation.endDate === reservation.endDate && r.confirmed === reservation.confirmed);
    
        // If the reservation with the matching username is found
        if (reservationIndex !== -1) {
          // Remove the reservation from the service
          foundService.reservations.splice(reservationIndex, 1);
          studio.service[serviceIndex].reservations = foundService.reservations;
          this.studioService.editStudioReservations(studio.id, studio);
        }
      }
    }

    confirmReservation(service: Service, reservation: Reservation){
        const serviceIndex = this.studio.service.findIndex(s => s.title === service.title);
      // If the service with the matching title is found
        if (serviceIndex !== -1) {
        // Access the found service
        const foundService = this.studio.service[serviceIndex];
    
        // Find the index of the reservation within the service based on the username
        const reservationIndex = foundService.reservations.findIndex(r => r && r.username === reservation.username &&
           r.startDate === r.startDate && reservation.endDate === reservation.endDate && r.confirmed === reservation.confirmed);
    
        // If the reservation with the matching username is found
        if (reservationIndex !== -1) {
          // Remove the reservation from the service
          foundService.reservations[reservationIndex].confirmed = 'true';
          this.studio.service[serviceIndex].reservations = foundService.reservations;
          this.studioService.editStudioReservations(this.studio.id, this.studio);
        }
      }
    }

    rejectReservation(service: Service, reservation: Reservation){
        const serviceIndex = this.studio.service.findIndex(s => s.title === service.title);
        // If the service with the matching title is found
          if (serviceIndex !== -1) {
          // Access the found service
          const foundService : Service = this.studio.service[serviceIndex];
      
          // Find the index of the reservation within the service based on the username
          console.log('errror' + serviceIndex)

          const reservationIndex = foundService.reservations.findIndex(r => r.username === reservation.username &&
             r.startDate === r.startDate && reservation.endDate === reservation.endDate && r.confirmed === reservation.confirmed);
      
          // If the reservation with the matching username is found
          if (reservationIndex !== -1) {
            // Remove the reservation from the service
            foundService.reservations[reservationIndex].confirmed = 'false';
            this.studio.service[serviceIndex].reservations = foundService.reservations;
            this.studioService.editStudioReservations(this.studio.id, this.studio);
          }
        }
    }

    filterReservation(reservation: any): boolean {
        if(reservation){
            switch (this.filterState) {
          case 'all':
            return true;
          case 'waiting':
            return reservation.confirmed === 'waiting';
          case 'true':
            return reservation.confirmed === 'true';
          case 'false':
            return reservation.confirmed === 'false';
          default:
            return false;
        }
        }
        
    }

    mapConfirmationStatus(status: string): string {
        switch (status) {
          case 'true':
            return 'Potwierdzone';
          case 'false':
            return 'Odrzucone';
          case 'waiting':
            return 'Oczekiwanie na akceptacje';
          default:
            return 'Unknown';
        }
      }

    

}
