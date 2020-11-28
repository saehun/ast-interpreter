import { Eva } from '..';
import { Environment } from '../Environment';

const eva = new Eva(
  new Environment({
    null: null,

    true: true,
    false: false,

    VERSION: '0.1',
  })
);

test('', () => {
  expect(eva.eval(1)).toEqual(1);
  expect(eva.eval('"hello"')).toEqual('hello');
  expect(eva.eval(['+', 3, 5])).toEqual(8);
  expect(eva.eval(['+', ['+', 3, 1], 5])).toEqual(9);

  expect(eva.eval(['var', 'x', 10])).toEqual(10);
  expect(eva.eval('x')).toEqual(10);
  expect(eva.eval(['var', 'y', 100])).toEqual(100);
  expect(eva.eval('y')).toEqual(100);

  expect(eva.eval('VERSION')).toEqual('0.1');
  expect(eva.eval(['var', 'isUser', 'true'])).toEqual(true);
});
