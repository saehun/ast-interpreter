import { Eva } from '..';
const eva = new Eva();

describe('Block expression of Eva', () => {
  it('can evaluate multiple expressions', () => {
    expect(eva.eval(['begin', ['var', 'x', 10], ['var', 'y', 20], ['+', 'x', 'y']])).toEqual(30);
  });
  it('can evaluate nested block expression', () => {
    expect(eva.eval(['begin', ['var', 'x', 10], ['begin', ['var', 'x', 20]], 'x'])).toEqual(10);
  });
  it('can access its closure scope', () => {
    expect(
      eva.eval([
        'begin',
        ['var', 'value', 10],
        ['var', 'result', ['begin', ['var', 'x', ['+', 'value', 10]], 'x']],
        'result',
      ])
    ).toEqual(20);
  });
  it('can set value to a variable of its closure scope', () => {
    expect(eva.eval(['begin', ['var', 'data', 10], ['begin', ['set', 'data', 20]], 'data'])).toEqual(20);
  });
});
