import { TestBed } from '@angular/core/testing';

import { SetAllocationService } from './set-allocation.service';

describe('SetAllocationService', () => {
  let service: SetAllocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetAllocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
