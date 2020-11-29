import { run } from './runner';

describe('User defined functions of Eva', () => {
  it('can create new function', () => {
    expect(
      run(`
        (begin
          (def square (x) (* x x))
          (square 2))
    `)
    ).toEqual(4);
  });

  it('can return inner function', () => {
    expect(
      run(`
        (begin
            (var value 100)
            (def calc (x y)
                  (begin
                  (var z (+ x y))
                  (def inner (foo)
                        (+ (+ foo z) value))
                  inner))
            (var fn (calc 10 20))
            (fn 30))
    `)
    ).toEqual(160);
  });
});
