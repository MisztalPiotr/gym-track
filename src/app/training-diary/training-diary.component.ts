// ...existing code...
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Day } from '../services/model/day.model';
import { Exercise } from '../services/model/exercise.model';
import { Set } from '../services/model/set.model';
import { TrainingDiaryService } from '../services/training-diary.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-training-diary',
  templateUrl: './training-diary.component.html',
  styleUrls: ['./training-diary.component.css']
})
export class TrainingDiaryComponent implements OnInit, OnDestroy {
  days: Day[] = [];
  currentDay: Day | null = null;
  menuOpen = false;
  newDayDate = '';
  currentExercises: Exercise[] = [];
  newExerciseName = '';
  userKey: string;
  selectedDate: string = '';

  // subs / fallback
  private authSub: any = null;
  private daysSub: any = null;
  private checkUserInterval: any = null;

  constructor(
    private diaryService: TrainingDiaryService,
    private authService: AuthService
  ) {
    this.userKey = authService.user?.email?.replace(/\./g, '_').toLowerCase() || '';
  }

 ngOnInit(): void {
  this.setToday();

  const userObs = (this.authService as any).user;

  if (userObs && typeof userObs.subscribe === 'function') {
    // AuthService exposes observable-like 'user'
    this.authSub = userObs.subscribe((user: any) => {
      if (user?.email) {
        const key = user.email.replace(/\./g, '_').toLowerCase();
        if (this.userKey !== key) {
          this.userKey = key;
          if (this.daysSub) {
            this.daysSub.unsubscribe();
            this.daysSub = null;
          }
          this.daysSub = this.diaryService.getDays(this.userKey).subscribe((days: Day[]) => {
            this.days = days || [];
            this.currentDay = this.days.length ? this.days[this.days.length - 1] : null;
            this.renderCurrentDay();
          });
        }
      }
    });
  } else {
    // Fallback: existing object or delayed auth - try immediate check, then interval
    if (this.authService.user?.email) {
      this.userKey = this.authService.user.email.replace(/\./g, '_').toLowerCase();
      this.daysSub = this.diaryService.getDays(this.userKey).subscribe((days: Day[]) => {
  this.days = days || [];

  // Jeśli użytkownik wybrał datę w UI — użyj jej
  if (this.newDayDate) {
    const selected = this.days.find(d => d.date === this.newDayDate);
    this.currentDay = selected || (this.days.length ? this.days[this.days.length - 1] : null);
  } else if (this.currentDay && this.currentDay.date) {
    // jeśli już mamy currentDay, spróbuj go odtworzyć z nowych danych (zapobiega przeskakiwaniu)
    const existing = this.days.find(d => d.date === this.currentDay!.date);
    this.currentDay = existing || (this.days.length ? this.days[this.days.length - 1] : null);
  } else {
    // fallback: ostatni dzień
    this.currentDay = this.days.length ? this.days[this.days.length - 1] : null;
  }

  this.renderCurrentDay();
      });
    } else {
      this.checkUserInterval = setInterval(() => {
        if (this.authService.user?.email) {
          clearInterval(this.checkUserInterval);
          this.checkUserInterval = null;
          this.userKey = this.authService.user.email.replace(/\./g, '_').toLowerCase();
          this.daysSub = this.diaryService.getDays(this.userKey).subscribe((days: Day[]) => {
            this.days = days || [];
            this.currentDay = this.days.length ? this.days[this.days.length - 1] : null;
            this.renderCurrentDay();
          });
        }
      }, 300);
    }
  }
}

ngOnDestroy(): void {
  if (this.authSub && typeof this.authSub.unsubscribe === 'function') {
    this.authSub.unsubscribe();
    this.authSub = null;
  }
  if (this.daysSub && typeof this.daysSub.unsubscribe === 'function') {
    this.daysSub.unsubscribe();
    this.daysSub = null;
  }
  if (this.checkUserInterval) {
    clearInterval(this.checkUserInterval);
    this.checkUserInterval = null;
  }
}

trackByExercise(index: number, exercise: Exercise): string {
  return exercise.name; // unikalny identyfikator dla Angulara
}
  setToday(): void {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.newDayDate = `${yyyy}-${mm}-${dd}`;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  addNewDay(): void {
    if (!this.newDayDate || this.days.find(d => d.date === this.newDayDate)) return;

    this.diaryService.addDay(this.userKey, this.newDayDate).then(() => {
      const newDay: Day = { date: this.newDayDate, exercises: [] };
      this.days.push(newDay);
      this.currentExercises = [];
      this.currentDay = newDay;
      this.renderCurrentDay();
    });
  }

  renderCurrentDay(): void {
    this.updateCurrentExercises();
  }

// ...existing code...
updateCurrentExercises(): void {
  if (!this.currentDay || !this.currentDay.exercises) {
    this.currentExercises = [];
    return;
  }

  // Zwróć nową tablicę i sklonowane ćwiczenia (bez referencji do oryginału)
  if (Array.isArray(this.currentDay.exercises)) {
    this.currentExercises = this.currentDay.exercises.map(exercise => ({
      name: exercise.name,
      sets: Array.isArray(exercise.sets) ? [...exercise.sets] : Object.values(exercise.sets || []),
      notes: (exercise as any).notes || ''
    }));
  } else {
    this.currentExercises = Object.keys(this.currentDay.exercises).map(key => {
      const e = (this.currentDay!.exercises as any)[key] || {};
      return {
        name: e.name || key,
        sets: Array.isArray(e.sets) ? [...e.sets] : Object.values(e.sets || []),
        notes: e.notes || ''
      };
    });
  }
}
 // ...existing code...


onDayChange(event: any): void {
  const selectedDate = event.target.value;
  const day = this.days.find(d => d.date === selectedDate);
  if (!day) return;

  this.currentDay = day;  // <-- currentDay musi być obiektem Day
  this.updateCurrentExercises();
}

  addExercise(): void {
  if (!this.newExerciseName.trim() || !this.currentDay) return;

  const safeName = this.newExerciseName.trim();

  // Wyślij do bazy i nie mutuj lokalnych obiektów — subskrypcja getDays zaktualizuje widok
  this.diaryService.addExercise(this.userKey, this.currentDay.date, safeName)
    .then(() => {
      console.log('Ćwiczenie dodane na serwerze:', this.userKey, this.currentDay!.date, safeName);
      // czyścimy input — widok zaktualizuje się z subskrypcji getDays
      this.newExerciseName = '';
    })
    .catch(err => console.error('Błąd dodawania ćwiczenia:', err));
}
}
// ...existing code...