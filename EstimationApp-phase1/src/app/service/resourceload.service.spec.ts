import { TestBed } from '@angular/core/testing';

import { ResourceloadService } from './resourceload.service';

describe('ResourceloadService', () => {
  let service: ResourceloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
