import { ValidateDiscountPipe } from './validate-discount.pipe';

describe('ValidateDiscountPipe', () => {
  it('create an instance', () => {
    const pipe = new ValidateDiscountPipe();
    expect(pipe).toBeTruthy();
  });
});
