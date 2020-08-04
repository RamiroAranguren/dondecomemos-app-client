import { TestBed } from '@angular/core/testing';

import { BackButtonServiceService } from './back-button-service.service';

describe('BackButtonServiceService', () => {
  let service: BackButtonServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackButtonServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
