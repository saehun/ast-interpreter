import { run } from './runner';

describe('Syntactic sugar of Eva', () => {
  it('switch transpiles to nested if expression', () => {
    expect(
      run(`
      (begin
        (var x 10)
        (switch ((> x 1) 100)
                ((= x 1) 200)
                (else 0)))
    `)
    ).toEqual(100);
  });

  it('for expression tanspiles to while expression', () => {
    expect(
      run(`
        (begin
            (var result 0)
            (for (var x 0)
                (< x 10)
                (set x (+ x 1))
                (set result (+ result x)))
            result)
    `)
    ).toEqual(45);
  });

  it('increment expression transpiles to add and set', () => {
    expect(run(`(begin (var x 10) (++ x) x)`)).toEqual(11);
  });
});
