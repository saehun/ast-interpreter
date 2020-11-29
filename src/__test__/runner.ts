import { Eva } from '..';
const evaParser = require('../../parser/evaParser');

export const run = (code: string): void => {
  return new Eva().eval(evaParser.parse(code));
};
