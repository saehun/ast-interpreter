import { run } from './runner';

describe('Module expression of Eva', () => {
  it('can create module', () => {
    expect(
      run(`
    (module Math
      (begin
        (def abs (value)
          (if (< value 0)
              (- value)
              value))
        (def square (x)
          (* x x))
        (var MAX_VALUE 1000)
      )
    )

    (var abs (prop Math abs))
    (abs (- 10))
    `)
    ).toEqual(10);
  });

  it('can store module field', () => {
    expect(
      run(`
    (module Math
      (begin
        (var MAX_VALUE 1000)
      )
    )
    (prop Math MAX_VALUE)
    `)
    ).toEqual(1000);
  });
});
