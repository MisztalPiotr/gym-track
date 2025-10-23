
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, Renderer2 } from '@angular/core';
import { Studio } from '../services/model/studio.model';
import { StudioService } from '../services/studio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
    selector: 'app-studio-edit-page',
    templateUrl: './studio-edit.component.html',
    styleUrls: ['./studio-edit.component.css']
})
export class StudioEditComponent implements OnInit {

    allStudios : Studio[] = [];

    constructor(private studioService: StudioService,private route: ActivatedRoute, private router: Router, private authService: AuthService, public afAuth: AngularFireAuth){
    
        this.studioService.getStudios().subscribe((s) => {
            
            this.allStudios = s.filter((studio) => {
                console.log(studio.ownerEmail);
                return studio.ownerEmail === this.authService.user.email;
            });
           
          });
        
    }
    
    ngOnInit(): void {
       
    }

    showDetails(studio: Studio){
        this.studioService.saveCurrentStudioToLocalStorage(studio);
        this.router.navigate(['/studio-edit-details']); 
    }

    deleteStudio(event: Event,studio: Studio){
       event.stopPropagation();
       this.studioService.deleteStudio(studio.id);
    }

    showReservations(studio: Studio){
        this.studioService.saveCurrentStudioToLocalStorage(studio);
        this.router.navigate(['/reservations-confirm']); 
    }

}