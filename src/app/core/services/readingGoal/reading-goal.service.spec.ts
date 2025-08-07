import { TestBed } from '@angular/core/testing';

import { ReadingGoalService } from './reading-goal.service';

describe('ReadingGoalService', () => {
  let service: ReadingGoalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingGoalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
