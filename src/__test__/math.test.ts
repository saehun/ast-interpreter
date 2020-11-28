import { Eva } from '..';
const eva = new Eva();

describe('Math expression of Eva ', () => {
  it('can add number', () => {
    expect(eva.eval(['+', 3, 5])).toEqual(8);
  });
  it('can evaluate nested', () => {
    expect(eva.eval(['+', ['+', 3, 1], 5])).toEqual(9);
  });
  it('can evaluate unary minus operation', () => {
    expect(eva.eval(['-', ['+', 3, 1]])).toEqual(-4);
  });
});
