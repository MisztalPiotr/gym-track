import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudioMainPageComponent } from './studio/studio-main-page.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../app/environments/environment';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { NavbarComponent } from 'src/navbar/navbar.component';
import { StudioNewComponent } from './studio/studio-new.component';
import { StudioDetailsComponent } from './studio/studio-details.component';
import { ReservationComponent } from './reservations/reservation.component';
import { StudioEditComponent } from './studio/studio-edit.component';
import { StudioEditDetailsComponent } from './studio/studio-edit-details.component';
import { ReservationConfirmComponent } from './reservations/reservation-confirm.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TrainingDiaryComponent } from './training-diary/training-diary.component';
import { ExerciseComponent } from './exercise/exercise.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SignupComponent,
        LoginComponent,
        DashboardComponent,
        NavbarComponent,
        StudioMainPageComponent,
        StudioNewComponent,
        StudioDetailsComponent,
        ReservationComponent,
        StudioEditComponent,
        StudioEditDetailsComponent,
        ReservationConfirmComponent,
        TrainingDiaryComponent,
        ExerciseComponent
    ],
    imports: [
        NgbModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,

        AngularFireModule.initializeApp(environment.firebaseConfig),  // imports firebase/app needed for everything
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
