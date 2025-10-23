import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Day } from './model/day.model';
import { Exercise } from './model/exercise.model';
import { Set } from './model/set.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingDiaryService {

  constructor(private db: AngularFireDatabase) {}

  // Pobranie wszystkich dni użytkownika
 // ...existing code...
getDays(userKey: string): Observable<Day[]> {
  return this.db.object(`trainingDays/${userKey}`).snapshotChanges().pipe(
    map(snapshot => {
      const daysData = snapshot.payload.val() || {};
      // Sortuj klucze (daty) rosnąco, żeby kolejność była przewidywalna
      return Object.keys(daysData)
        .sort()
        .map(date => {
          const day = daysData[date] || {};
          const exercisesObj = day.exercises || {};
          const exercises: Exercise[] = Object.keys(exercisesObj || {}).map(key => {
            const e = exercisesObj[key] || {};
            return {
              name: e.name || key,
              sets: Array.isArray(e.sets) ? [...e.sets] : Object.values(e.sets || []),
              notes: e.notes || ''
            } as Exercise;
          });
          return { date, exercises };
        });
    })
  );
}
// ...existing code...

  // Dodanie nowego dnia
  addDay(userKey: string, date: string): Promise<void> {
    return this.db.object(`trainingDays/${userKey}/${date}`).set({ exercises: [] });
  }

  // Dodanie ćwiczenia do dnia (notes opcjonalne)
addExercise(userKey: string, date: string, exerciseName: string, notes?: string): Promise<void> {
  if (!exerciseName || !exerciseName.trim()) {
    return Promise.reject('Nazwa ćwiczenia jest pusta');
  }

  const safeName = exerciseName.trim();
  const exercise: Exercise = { 
    name: safeName, 
    sets: [] 
  };

  if (notes && notes.trim() !== '') {
    exercise.notes = notes;
  }

  // Zamiast push → używamy set() pod kluczem nazwy ćwiczenia
  const exerciseRef = this.db.object<Exercise>(`trainingDays/${userKey}/${date}/exercises/${safeName}`);
  return exerciseRef.set(exercise);
}

  // Dodanie serii do ćwiczenia
  // exerciseKey to klucz ćwiczenia w Firebase (może być index zamieniony na string)
  addSet(userKey: string, date: string, exerciseKey: string, set: Set): Promise<void> {
  const setsRef = this.db.list<Set>(`trainingDays/${userKey}/${date}/exercises/${exerciseKey}/sets`);
  return setsRef.push(set).then(() => {});
}

  // Aktualizacja notes w ćwiczeniu
  updateExerciseNotes(userKey: string, date: string, exerciseKey: string, notes: string): Promise<void> {
    return this.db.object(`trainingDays/${userKey}/${date}/exercises/${exerciseKey}/notes`).set(notes);
  }

  // Usuwanie ćwiczenia z dnia
  removeExercise(userKey: string, date: string, exerciseKey: string): Promise<void> {
    return this.db.object(`trainingDays/${userKey}/${date}/exercises/${exerciseKey}`).remove();
  }

  // Usuwanie całego dnia
  removeDay(userKey: string, date: string): Promise<void> {
    return this.db.object(`trainingDays/${userKey}/${date}`).remove();
  }
}
