import { TestBed } from '@angular/core/testing';

import { TrainingDiaryService } from './training-diary.service';

describe('TrainingDiaryService', () => {
  let service: TrainingDiaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingDiaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
