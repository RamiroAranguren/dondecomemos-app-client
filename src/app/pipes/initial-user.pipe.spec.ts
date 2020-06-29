import { InitialUserPipe } from './initial-user.pipe';

describe('InitialUserPipe', () => {
  it('create an instance', () => {
    const pipe = new InitialUserPipe();
    expect(pipe).toBeTruthy();
  });
});
