import { Component, Input } from '@angular/core';
import { TrainingDiaryService } from '../services/training-diary.service';
import { Day } from '../services/model/day.model';
import { Exercise } from '../services/model/exercise.model';
import { Set } from '../services/model/set.model';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent {
  @Input() exercise!: Exercise;
  @Input() userKey!: string;
  @Input() currentDay!: { date: string };

  newReps!: number;
  newWeight!: number;

  constructor(private diaryService: TrainingDiaryService) {}

  addSet(event: Event): void {
    event.preventDefault();
    if (!this.currentDay || !this.exercise) return;

    const reps = this.newReps;
    const weight = this.newWeight;

    if (!reps || !weight) return;

    const setNumber = this.exercise.sets.length + 1;
    const set: Set = { set: setNumber, reps, weight };

    // Dodajemy serię do odpowiedniego ćwiczenia w DiaryService
    this.diaryService.addSet(this.userKey, this.currentDay.date, this.exercise.name, set)
      .then(() => {
        console.log(this.exercise.name)
        // Czyszczenie pól input
        this.newReps = 0;
        this.newWeight = 0;
      })
      .catch(err => console.error('Błąd dodawania serii:', err));
  }
}
