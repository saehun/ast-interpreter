import { run } from './runner';

describe('import expression of Eva', () => {
  it('can import module', () => {
    expect(
      run(`
    (import Math)
    ((prop Math abs) (- 10))
  `)
    ).toEqual(10);
  });
});
