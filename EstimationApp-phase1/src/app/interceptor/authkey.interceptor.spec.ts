import { TestBed } from '@angular/core/testing';

import { AuthkeyInterceptor } from './authkey.interceptor';

describe('AuthkeyInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthkeyInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthkeyInterceptor = TestBed.inject(AuthkeyInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
