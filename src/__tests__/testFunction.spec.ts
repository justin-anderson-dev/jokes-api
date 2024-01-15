import { add } from '../testFunction';

describe('add function', () => {
  it('should return the sum of two numbers', () => {
    const result = add(1, 2);
    expect(result).toBe(3);
  });

  it('should return a number', () => {
    const result = add(1, 2);
    expect(typeof result).toBe('number');
  });
});
