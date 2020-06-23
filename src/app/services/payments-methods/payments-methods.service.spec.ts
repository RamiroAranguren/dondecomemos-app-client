import { TestBed } from '@angular/core/testing';

import { PaymentsMethodsService } from './payments-methods.service';

describe('PaymentsMethodsService', () => {
  let service: PaymentsMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentsMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
