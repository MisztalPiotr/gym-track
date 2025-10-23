import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDiaryComponent } from './training-diary.component';

describe('TrainingDiaryComponent', () => {
  let component: TrainingDiaryComponent;
  let fixture: ComponentFixture<TrainingDiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingDiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
