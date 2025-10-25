import { Component, Input , AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import { TrainingDiaryService } from '../services/training-diary.service';
import { Day } from '../services/model/day.model';
import { Exercise } from '../services/model/exercise.model';
import { Set } from '../services/model/set.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements AfterViewInit, OnChanges{
  @Input() exercise!: Exercise;
  @Input() userKey!: string;
  @Input() currentDay!: { date: string };
  @Input() allDays: Day[] = []; // wszystkie dni przekazywane z TrainingDiaryComponent

  newReps!: number;
  newWeight!: number;
  chart!: Chart;

  constructor(private diaryService: TrainingDiaryService) { }

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    // jeśli zmienią się wszystkie dni lub exercise, odśwież wykres
    if (changes.allDays || changes.exercise) {
      this.refreshChart();
    }
  }

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

 // Oblicza maksymalne ciężary dla każdego dnia
  getMaxWeightPerDay() {
    return this.allDays
      .map(day => {
        const ex = day.exercises.find(e => e.name === this.exercise.name);
        if (!ex || !ex.sets || ex.sets.length === 0) return null;
        const maxWeight = Math.max(...ex.sets.map(s => s.weight));
        return { date: day.date, maxWeight };
      })
      .filter(item => item !== null);
  }

  createChart() {
    const data = this.getMaxWeightPerDay();
    const labels = data.map(d => d!.date);
    const weights = data.map(d => d!.maxWeight);

    const ctx = document.getElementById(`chart-${this.exercise.name}`) as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Max kg',
          data: weights,
          borderColor: '#95e654',
          backgroundColor: 'rgba(149, 230, 84, 0.2)',
          fill: true,
        }]
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: { beginAtZero: true }
          }],
          xAxes: [{
            ticks: { autoSkip: false }
          }]
        }
      }
    });
  }

  refreshChart() {
    if (this.chart) {
      const data = this.getMaxWeightPerDay();
      this.chart.data.labels = data.map(d => d!.date);
      this.chart.data.datasets[0].data = data.map(d => d!.maxWeight);
      this.chart.update();
    } else {
      this.createChart();
    }
  }
}
