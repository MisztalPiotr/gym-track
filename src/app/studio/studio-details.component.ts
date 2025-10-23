import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, Renderer2 } from '@angular/core';
import { Studio } from '../services/model/studio.model';
import { StudioService } from '../services/studio.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Reservation } from '../services/model/reservation.model';
import { Service } from '../services/model/service.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-studio-details-page',
    templateUrl: './studio-details.component.html',
    styleUrls: ['./studio-details.component.css']
})
export class StudioDetailsComponent implements OnInit {

  studio: Studio;
  selectedDate: string = new Date().toISOString().split('T')[0];
  options: string[] = [];
  clientName: string;
  user: firebase.default.User | null;

  constructor(
    private studioService: StudioService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public afAuth: AngularFireAuth
  ) {
    afAuth.authState.subscribe(user => {
        this.user = user;
      });
  }

  ngOnInit(): void {
    this.studio = this.studioService.currentStudio;
    console.log(this.studio);
    this.options = ['9:00', '10:00', '11:00', '12:00'];
  }
 
  updateOptions(currentService: Service): void {
    console.log(this.selectedDate);
    console.log(currentService);
  
    this.options = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  
    if (currentService.reservations && Array.isArray(currentService.reservations)) {
      const reservations: Reservation[] = currentService.reservations.filter(reservation =>
        reservation.startDate.includes(this.selectedDate)
      );
  
      const hoursArray: string[] = reservations.map(reservation => {
        const startTime: string[] = reservation.startDate.split(' ');
        const time: string[] = startTime[1].split(':');
        return `${time[0]}:${time[1]}`;
      });
  
      this.options = this.options.filter(option => !hoursArray.includes(option));
    }
  }

  openSweetAlert(currentService: Service): void {
    Swal.fire({
      title: '',
      html: `
        <label for="name">Podaj Imię:</label>
        <input type="text" id="name" class="form-control">
        <label for="datepicker">Wybierz datę:</label>
        <input type="date" id="datepicker" class="form-control">
      `,
      confirmButtonText: 'OK',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      preConfirm: async () => {
        const dateSelect = document.getElementById('datepicker') as HTMLInputElement;
        const name = document.getElementById('name') as HTMLInputElement;
        this.clientName = name.value;
        this.selectedDate = dateSelect.value;
        return {
          date: dateSelect.value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
       
        this.updateOptions(currentService);
        
        Swal.fire({
            title: '',
            html: `
            <label for="options">Wybierz godzinę:</label>
            <select id="options" class="form-control">
              ${this.options.map(option => `<option value="${option}">${option}</option>`).join('')}
            </select>
            `,
            confirmButtonText: 'OK',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            preConfirm: async () => {
            const optionsSelect = document.getElementById('options') as HTMLSelectElement;
        
              return {
                option: optionsSelect.value
              };
            }
          }).then((result) => {
            if (result.isConfirmed) {
              // Handle the selected date and option (result.value.date, result.value.option)
              Swal.fire('Twój termin to:', `${this.selectedDate}` + ' ' + `${result.value.option}`, 'success');

              let tempName = "";
              if(!this.user){
                tempName = this.clientName;
              }else{
                tempName = this.user.email;
              }
              const reservation: Reservation = 
                {
                  username: tempName,
                  confirmed: 'waiting',
                  startDate: this.selectedDate + " " + result.value.option,
                  endDate: this.selectedDate + " " + result.value.option
                }
              
                const foundService = this.studio.service.find(service => (
                    service.title === currentService.title &&
                    service.description === currentService.description
                  ));
                  
                  console.log("last" + foundService.reservations)
                  if (foundService) {
                    if (!foundService.reservations || !Array.isArray(foundService.reservations)) {
                        foundService.reservations = []; 
                      }
                    foundService.reservations.push(reservation);
                  } else {
                    console.error('Service not found in the array');
                  }
             
              this.studioService.editStudio(this.studio.id.toString(), this.studio);
            }
          });
      }
    });

    
  }
   
 
}