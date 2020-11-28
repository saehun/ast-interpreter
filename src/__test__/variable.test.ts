import { Eva } from '..';
const eva = new Eva();

describe('Variable of Eva', () => {
  it('can assign number', () => {
    expect(eva.eval(['var', 'x', 10])).toEqual(10);
    expect(eva.eval('x')).toEqual(10);
  });
  it('can assign string', () => {
    expect(eva.eval(['var', 'y', '"hello"'])).toEqual('hello');
    expect(eva.eval('y')).toEqual('hello');
  });
  it('can assign boolean', () => {
    expect(eva.eval(['var', 'isUser', 'true'])).toEqual(true);
  });
});
