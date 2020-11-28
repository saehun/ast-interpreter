export class Eva {
  eval(exp: any): any {
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    if (exp[0] === '+') {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }

    throw 'Unimplemented';
  }
}

function isNumber(exp: unknown): exp is number {
  return typeof exp === 'number';
}

function isString(exp: unknown): exp is string {
  return typeof exp == 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}
