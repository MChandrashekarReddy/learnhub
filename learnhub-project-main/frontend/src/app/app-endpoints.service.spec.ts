import { TestBed } from '@angular/core/testing';

import { AppEndpointsService } from './app-endpoints.service';

describe('AppEndpointsService', () => {
  let service: AppEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppEndpointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
