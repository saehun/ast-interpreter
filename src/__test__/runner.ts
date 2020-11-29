import { Eva } from '..';
const evaParser = require('../../parser/evaParser');

export const run = (code: string): void => {
  return new Eva().evalGlobal(evaParser.parse(`(begin ${code})`));
};
