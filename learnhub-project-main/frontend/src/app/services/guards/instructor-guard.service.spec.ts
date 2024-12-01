import { TestBed } from '@angular/core/testing';

import { InstructorGuardService } from './instructor-guard.service';

describe('InstructorGuardService', () => {
  let service: InstructorGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
