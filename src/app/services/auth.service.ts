import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userLoggedIn: boolean;      // other components can check on this variable for the login status of the user
    isAdmin: boolean;
    user: firebase.default.User | null;
    email = '';
    constructor(private router: Router, private afAuth: AngularFireAuth) {
        this.userLoggedIn = false;
        this.isAdmin = false;
        this.initializeCurrentUser();
        this.afAuth.onAuthStateChanged((user) => {     
            this.user = user;         // set up a subscription to always know the login status of the user
            if (user) {
                this.saveCurrentUserToLocalStorage(user);
                this.userLoggedIn = true;
                this.email = user.email;
                this.setAdminStateIfPermited(user);
            } else {
                this.saveCurrentUserToLocalStorage(user);
                this.userLoggedIn = false;
                this.setAdminStateIfPermited(user);
            }
        });
    }

    initializeCurrentUser() {
        const storedObject = localStorage.getItem('user');
        this.user = storedObject ? JSON.parse(storedObject) : null;
      }
  
      saveCurrentUserToLocalStorage(user: firebase.default.User): void {
        const userString = JSON.stringify(user);
        localStorage.setItem('user', userString);
        this.user = user;
      }

    loginUser(email: string, password: string): Promise<any> {
        return this.afAuth.signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('Auth Service: loginUser: success');
                // this.router.navigate(['/dashboard']);
            })
            .catch(error => {
                console.log('Auth Service: login error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code)
                    return { isValid: false, message: error.message };
            });
    }

    signupUser(user: any): Promise<any> {
        return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
            .then((result) => {
                let emailLower = user.email.toLowerCase();
                result.user.sendEmailVerification();                    // immediately send the user a verification email
            })
            .catch(error => {
                console.log('Auth Service: signup error', error);
                if (error.code)
                    return { isValid: false, message: error.message };
            });
    }

    setAdminStateIfPermited(user: any){

        if(!user){
            this.isAdmin = false;
            return;
        }

        if(user.email === "bookeradmin@gmail.com"){
            this.isAdmin = true;
        }
        else{
            this.isAdmin = false;
        }
    }
}
