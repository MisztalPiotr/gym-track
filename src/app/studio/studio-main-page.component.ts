import { Component, OnInit } from '@angular/core';
import { Studio } from '../services/model/studio.model';
import { StudioService } from '../services/studio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-studio-main-page',
    templateUrl: './studio-main-page.component.html',
    styleUrls: ['./studio-main-page.component.css']
})
export class StudioMainPageComponent implements OnInit {
    hairdresserType : String = "hairdresser";
    makeupType : String = "makeup";
    allType : String = 'all';
    presentedStudios: Studio[] = [];
    allStudios : Studio[] = [];
    hairdresserStudios: Studio[] = [];
    makeupStudios: Studio[] = [];
    studioType: String;
    constructor(private studioService: StudioService,private route: ActivatedRoute, private router: Router, private authService: AuthService){
        this.studioService.getStudios().subscribe((s) => {
            console.log(s);
            this.presentedStudios = s;
            this.allStudios = s;
            if(this.studioType === this.makeupType){
                this.loadMakeupStudios();
             }

             if(this.studioType === this.hairdresserType){
                this.loadHairdresserStudios();
             }
          });
        
    }
    
    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
             this.studioType = params.get('studioType');
             if(this.studioType === this.makeupType){
                this.loadMakeupStudios();
             }

             if(this.studioType === this.hairdresserType){
                this.loadHairdresserStudios();
             }

             if(this.studioType === this.allType){
                this.loadAllStudios();
             }
           
        });
    }

    private loadHairdresserStudios(){
        this.presentedStudios = this.allStudios.filter(studio => studio.type === this.hairdresserType);
    }

   
    private loadMakeupStudios(){
        this.presentedStudios = this.allStudios.filter(studio => studio.type === this.makeupType);
    }

    private loadAllStudios(){
        this.presentedStudios = this.allStudios;
    }
    
    getStudios(){

    }
    showDetails(studio: Studio){
        this.studioService.saveCurrentStudioToLocalStorage(studio);
        this.router.navigate(['/studio-details']); 
    }

    deleteStudio(event: Event,studio: Studio){
        event.stopPropagation();
       this.studioService.deleteStudio(studio.id);
    }

}