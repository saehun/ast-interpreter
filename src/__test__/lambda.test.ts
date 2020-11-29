import { run } from './runner';

/**
 * (lambda <params> <body>)
 */
describe('lambda expression of Eva', () => {
  it('can be used as callback', () => {
    expect(
      run(`
        (begin
          (def onClick (callback)
             (begin
               (var x 10)
               (var y 20)
               (callback (+ x y))))
          (onClick (lambda (data) (* data 10))))
    `)
    ).toEqual(300);
  });

  it('can invoke immediately', () => {
    expect(
      run(`
         ((lambda (x) (* x x)) 10)
      `)
    ).toEqual(100);
  });

  it('can be saved in variable', () => {
    expect(
      run(`
         (begin
           (var square (lambda (x) (* x x)))
           (square 2)
         )
      `)
    ).toEqual(4);
  });
});
