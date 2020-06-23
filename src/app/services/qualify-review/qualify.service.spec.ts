import { TestBed } from '@angular/core/testing';

import { QualifyService } from './qualify.service';

describe('QualifyService', () => {
  let service: QualifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
