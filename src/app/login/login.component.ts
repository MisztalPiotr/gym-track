import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { StudioService } from '../services/studio.service'; // Import your StudioService
import { Studio } from '../services/model/studio.model';
import { Service } from '../services/model/service.model';
import { Reservation } from '../services/model/reservation.model';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    firebaseErrorMessage: string;

    constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth, private studioService: StudioService) {
        this.loginForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', Validators.required)
        });

        this.firebaseErrorMessage = '';
    }

    ngOnInit(): void {
        
    }

    loginUser() {

       
        if (this.loginForm.invalid)
            return;

        this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).then((result) => {
            if (result == null) {                               // null is success, false means there was an error
                console.log('logging in...');
                this.router.navigate(['/studio-main-page','all']);                // when the user is logged in, navigate them to dashboard
            }
            else if (result.isValid == false) {
                console.log('login error', result);
                this.firebaseErrorMessage = result.message;
                   
            }
        });
    }
}
