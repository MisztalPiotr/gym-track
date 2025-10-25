import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app'; // Import the 'firebase/app' module

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

    isCollapsed = true;
    user: firebase.default.User | null;
    menuOpen = false;
    constructor(public afAuth: AngularFireAuth) {
        
      afAuth.authState.subscribe(user => {
        this.user = user;
      });
    }
    ngOnInit(): void {
        
    }

    logout(): void {
        this.afAuth.signOut();
    }

    

  
}
