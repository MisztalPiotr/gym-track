import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AuthGuard } from './services/auth.guard';
import { StudioMainPageComponent } from './studio/studio-main-page.component';
import { StudioNewComponent } from './studio/studio-new.component';
import { StudioDetailsComponent } from './studio/studio-details.component';
import { ReservationComponent } from './reservations/reservation.component';
import { StudioEditComponent } from './studio/studio-edit.component';
import { StudioEditDetailsComponent } from './studio/studio-edit-details.component';
import { ReservationConfirmComponent } from './reservations/reservation-confirm.component';
import { TrainingDiaryComponent } from './training-diary/training-diary.component';

const routes: Routes = [
    { path: '', redirectTo: 'studio-main-page/all', pathMatch: 'full' },
    { path: 'studio-details', component: StudioDetailsComponent },
    { path: 'reservations', component: ReservationComponent },
    { path: 'reservations-confirm', component: ReservationConfirmComponent },
    { path: 'studio-edit', component: StudioEditComponent },
    {path: 'training-diary',component: TrainingDiaryComponent},
    { path: 'studio-edit-details', component: StudioEditDetailsComponent },
    { path: 'studio-main-page/:studioType', component: StudioMainPageComponent },
    { path: 'studio-new', component: StudioNewComponent, canActivate: [AuthGuard] },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: '**', component: HomeComponent },                       // catch-all in case no other path matched
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
