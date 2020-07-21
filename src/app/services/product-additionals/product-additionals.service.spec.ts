import { TestBed } from '@angular/core/testing';

import { ProductAdditionalsService } from './product-additionals.service';

describe('ProductAdditionalsService', () => {
  let service: ProductAdditionalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductAdditionalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
