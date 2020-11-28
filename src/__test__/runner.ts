import { Eva } from '..';
const evaParser = require('../../parser/evaParser');

export const run = (description: string, code: string, result: any): void => {
  const eva = new Eva();
  it(description, () => {
    const exp = evaParser.parse(code);
    expect(eva.eval(exp)).toEqual(result);
  });
};
