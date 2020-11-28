import { Eva } from '..';
const eva = new Eva();

describe('Expression of eva', () => {
  it('can be a number', () => {
    expect(eva.eval(1)).toEqual(1);
  });
  it('can be a string', () => {
    expect(eva.eval('"hello"')).toEqual('hello');
  });
  it('can be a boolean', () => {
    expect(eva.eval('true')).toEqual(true);
  });
  it('can store global variable in its environment', () => {
    expect(eva.eval('VERSION')).toEqual('0.1');
  });
});
