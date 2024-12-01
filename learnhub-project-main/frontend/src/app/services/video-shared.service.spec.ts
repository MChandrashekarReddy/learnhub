import { TestBed } from '@angular/core/testing';

import { VideoSharedService } from './video-shared.service';

describe('VideoSharedService', () => {
  let service: VideoSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
