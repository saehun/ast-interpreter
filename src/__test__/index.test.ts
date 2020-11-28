import { Eva } from '..';

const eva = new Eva();

test('', () => {
  expect(eva.eval(1)).toEqual(1);
  expect(eva.eval('"hello"')).toEqual('hello');
  expect(eva.eval(['+', 3, 5])).toEqual(8);
  expect(eva.eval(['+', ['+', 3, 1], 5])).toEqual(9);
});
