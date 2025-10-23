import { Component, OnInit } from '@angular/core';
import { Studio } from '../services/model/studio.model';
import { StudioService } from '../services/studio.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-studio-edit-details-page',
    templateUrl: './studio-edit-details.component.html',
    styleUrls: ['./studio-edit-details.component.css']
})
export class StudioEditDetailsComponent implements OnInit {
    
    studio: Studio;
    studioForm: FormGroup;
    serviceForm: FormGroup;
    imageUrl: string | null = null; 
    imageServiceUrl : string | null = null; 
    imageForm: FormGroup;
    imageServiceForm: FormGroup;
    selectedFileName: string | null = null;
    selectedServiceFileName: string | null = null;

    selectedFile: File | undefined;  
    selectedServiceFile: File | undefined;  
    newStudio: Studio = {
        id: "1",
        studioName: "",
        location:  "",
        type: "",
        ownerUsername: "",
        ownerEmail: "",
        service:[],
        imageUrl:"",
      };
    businessTypes: string[] = ['makijaż', 'fryzjer', 'wszystko']; 

    constructor(private studioService: StudioService, private router: Router, private authService: AuthService){
        this.studio = this.studioService.currentStudio;
        this.studioForm = new FormGroup({
            'studioName': new FormControl("", Validators.required),
            'type': new FormControl(this.studio.type, Validators.required),
            'location': new FormControl(this.studio.location, Validators.required),
            'ownerUsername': new FormControl(this.studio.ownerUsername, Validators.required)
        });

        this.serviceForm = new FormGroup({
            'title': new FormControl('', Validators.required),
            'description': new FormControl('', Validators.required),
        });
        this.imageForm = new FormGroup({
            'file': new FormControl(['']),
          });
        this.imageServiceForm = new FormGroup({
            'serviceFile': new FormControl(['']),
          });

        this.intializeStudio();
       
    }

    ngOnInit(): void {
        this.studio = this.studioService.currentStudio;
        console.log(this.studio);
    }

    intializeStudio(){
        const typeMapping = {
            'hairdresser':'fryzjer',
            'makeup' : 'makijaż',
            'all' : 'wszystko'
          };

      
        this.studioForm.get('studioName').setValue(this.studio.studioName);
        this.studioForm.get('type').setValue(typeMapping[this.studio.type] || this.studio.type);
        this.studioForm.get('location').setValue(this.studio.location);
        this.studioForm.get('ownerUsername').setValue(this.studio.ownerUsername);
       
        this.newStudio = this.studio;
        this.imageUrl = this.newStudio.imageUrl;
    }

    addStudio(){
        console.log(this.studioForm);
        console.log(this.newStudio)
        const typeMapping = {
          'fryzjer': 'hairdresser',
          'makijaż': 'makeup',
          'wszystko' : 'all'
        };
        this.newStudio.location = this.studioForm.value.location,
        this.newStudio.type = typeMapping[this.studioForm.value.type] || this.studioForm.value.type,
        this.newStudio.ownerUsername =  this.studioForm.value.ownerUsername,
        this.newStudio.studioName = this.studioForm.value.studioName,
        this.newStudio.ownerEmail = this.authService.user.email;
        this.studioService.editStudio(this.studio.id, this.newStudio);   
    }

    addService(){
        const newService = {
            title: this.serviceForm.value.title,
            description: this.serviceForm.value.description,
            imageUrl: this.imageServiceUrl,
            reservations: []
          };
        if(!this.newStudio.service){
            this.newStudio.service = [];
        }
        console.log(newService)
        this.newStudio.service.push(newService)
        this.imageServiceUrl = null;
        this.selectedServiceFileName = null;
    }

    deleteService(title: String, description: String){
        this.newStudio.service = this.newStudio.service.filter(service => !(service.title === title &&  service.description === description));
    }
    onFileChange(event: Event){

    }
    handleFileInput(event: any): void {
        this.selectedFile = event.target.files[0] as File;
        this.selectedFileName = this.selectedFile.name;
    }
    
    uploadImage(): void {
        if (this.selectedFile) {
          const reader = new FileReader();
    
          reader.onload = (e: any) => {
            this.imageUrl = e.target.result;
          };
    
          reader.readAsDataURL(this.selectedFile);
           this.studioService.uploadFile(this.selectedFile).then((imageUrl) => {
            this.newStudio.imageUrl = imageUrl;
           });
           
        }
      }

      handleFileServiceInput(event: any): void {
        this.selectedServiceFile = event.target.files[0] as File;
        this.selectedServiceFileName = this.selectedServiceFile.name;
    }

      uploadServiceImage(): void {
        if (this.selectedServiceFile) {
          const reader = new FileReader();
    
          reader.onload = (e: any) => {
            this.imageServiceUrl = e.target.result;
          };
    
          reader.readAsDataURL(this.selectedServiceFile);
           this.studioService.uploadServiceFile(this.selectedServiceFile).then((imageServiceUrl) => {
            this.imageServiceUrl = imageServiceUrl;
           });
           
        }
      }
}