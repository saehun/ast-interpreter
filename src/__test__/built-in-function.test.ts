import { run } from './runner';

describe('Built-in functions of Eva', () => {
  it('can calculate arithmatic operations', () => {
    expect(run('(+ 1 2)')).toEqual(3);
    expect(run('(- 1 2)')).toEqual(-1);
    expect(run('(- 1)')).toEqual(-1);
    expect(run('(* 2 2)')).toEqual(4);
    expect(run('(/ 10 2)')).toEqual(5);
  });

  it('can calculate comparisonal operations', () => {
    expect(run('(= 1 1)')).toEqual(true);
    expect(run('(> 1 2)')).toEqual(false);
    expect(run('(>= 1 2)')).toEqual(false);
    expect(run('(<= 1 2)')).toEqual(true);
    expect(run('(< 1 2)')).toEqual(true);
  });
});
