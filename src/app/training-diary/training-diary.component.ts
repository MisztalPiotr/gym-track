import { Component, OnInit } from '@angular/core';
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
export class TrainingDiaryComponent implements OnInit {
  days: Day[] = [];
  currentDay: Day | null = null;
  menuOpen = false;
  newDayDate = '';
  currentExercises: Exercise[] = [];
  newExerciseName = '';
  userKey: string;
  selectedDate: string = '';
  constructor(
    private diaryService: TrainingDiaryService,
    private authService: AuthService
  ) {
    this.userKey = authService.user?.email.replace(/\./g, '_').toLowerCase() || '';
  }

 ngOnInit(): void {
  this.setToday();

  const checkUser = setInterval(() => {
    if (this.authService.user?.email) {
      clearInterval(checkUser);
      this.userKey = this.authService.user.email.replace(/\./g, '_').toLowerCase();

      this.diaryService.getDays(this.userKey).subscribe(days => {
        this.days = days;
        if (days.length > 0) this.currentDay = days[days.length - 1];
        this.renderCurrentDay();
      });
    }
  }, 300);
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
      this.currentDay = newDay;
      this.renderCurrentDay();
    });
  }

  renderCurrentDay(): void {
    this.updateCurrentExercises();
  }

updateCurrentExercises(): void {
  if (!this.currentDay || !this.currentDay.exercises) {
    this.currentExercises = []; // Ustaw pustą tablicę, jeśli nie ma ćwiczeń
    return;
  }

  // Przypisz nową referencję do currentExercises, aby Angular wykrył zmianę
  this.currentExercises = Object.keys(this.currentDay.exercises).map(key => {
    const exercise = this.currentDay.exercises[key];
    return {
      name: exercise.name,
      sets: Object.values(exercise.sets || [])
    };
  });

  // Jeśli chcesz zaktualizować dane na wykresach, możesz to zrobić tutaj
  // np. wywołać funkcję rysującą wykresy lub odświeżającą dane
  console.log(this.currentExercises); // Sprawdzenie wyników w konsoli
}


onDayChange(event: any): void {
  const selectedDate = event.target.value;
  const day = this.days.find(d => d.date === selectedDate);
  if (!day) return;

  this.currentDay = day;  // <-- currentDay musi być obiektem Day
  this.updateCurrentExercises();
}

  addExercise(): void {
  if (!this.newExerciseName.trim() || !this.currentDay) return; // Sprawdzenie, czy nazwa ćwiczenia jest poprawna

  const exercise: Exercise = { 
    name: this.newExerciseName, 
    sets: [] 
  };

  // Dodajemy ćwiczenie do bazy
  this.diaryService.addExercise(this.userKey, this.currentDay.date, this.newExerciseName)
    .then(() => {
      // Dodajemy ćwiczenie do bieżącego dnia
      this.currentDay!.exercises.push(exercise);

      // Od razu dodajemy do currentExercises
      this.currentExercises.push(exercise);

      console.log('Ćwiczenie dodane:', this.userKey, this.currentDay.date, this.newExerciseName);

      // Czyścimy pole input dla nazwy ćwiczenia
      this.newExerciseName = '';
    })
    .catch(err => console.error('Błąd dodawania ćwiczenia:', err));
}


addSet(event: Event, exercise: Exercise): void {
  event.preventDefault();
  if (!this.currentDay || !exercise) return;

  const form = event.target as HTMLFormElement;
  const repsInput = form.querySelector<HTMLInputElement>('input[name="reps"]');
  const weightInput = form.querySelector<HTMLInputElement>('input[name="weight"]');
  if (!repsInput || !weightInput) return;

  const reps = parseInt(repsInput.value);
  const weight = parseFloat(weightInput.value);
  if (isNaN(reps) || isNaN(weight)) return;

  const setNumber = exercise.sets.length + 1;
  const set: Set = { set: setNumber, reps, weight };

  // Dodajemy serię do odpowiedniego ćwiczenia
  this.diaryService.addSet(this.userKey, this.currentDay.date, exercise.name, set)
    .then(() => {
      // Aktualizujemy ćwiczenie w currentDay
      const dayExercise = this.currentDay!.exercises.find(ex => ex.name === exercise.name);
      if (dayExercise) {
        dayExercise.sets = Array.isArray(dayExercise.sets)
          ? [...dayExercise.sets, set] // Dodajemy serię do ćwiczenia
          : [set];
      }

      // Aktualizujemy currentExercises
      this.currentExercises = this.currentExercises.map(ex => {
        if (ex.name === exercise.name) {
          return { ...ex, sets: [...ex.sets || [], set] }; // Dodajemy serię do ćwiczenia
        }
        return ex;
      });

      // Czyszczenie pól input
      repsInput.value = '';
      weightInput.value = '';
    })
    .catch(err => console.error('Błąd dodawania serii:', err));
}



}
