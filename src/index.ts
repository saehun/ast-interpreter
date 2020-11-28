import { Environment } from './Environment';

export class Eva {
  private global: Environment;

  /**
   * Creates an Evan instance with the global environment.
   */
  constructor(
    global = new Environment({
      null: null,
      true: true,
      false: false,
      VERSION: '0.1',
    })
  ) {
    this.global = global;
  }

  /**
   * Evaluate an expression in the given environment.
   */
  eval(exp: any, env = this.global): any {
    /**
     * Self evaluating expressions
     */
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    /**
     * Math expressions
     */
    if (exp[0] === '+') {
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }

    if (exp[0] === '-') {
      const [, left, right] = exp;
      if (right === undefined) {
        return 0 - this.eval(left, env);
      } else {
        return this.eval(left, env) - this.eval(right, env);
      }
    }

    /**
     * Variable declaration: (var foo 10)
     */
    if (exp[0] === 'var') {
      const [, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    /**
     * Variable update: (set foo 10)
     */
    if (exp[0] === 'set') {
      const [, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    /**
     * Block sequence of expressions
     */
    if (exp[0] === 'begin') {
      return this.evaluateBlock(exp, new Environment({}, env));
    }

    /**
     * Variable access
     */
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplemented: ${JSON.stringify(exp, undefined, 2)}`;
  }

  private evaluateBlock(exp: any, env: Environment) {
    const [, ...expressions] = exp;
    let result: any;
    expressions.forEach((exp: any) => {
      result = this.eval(exp, env);
    });
    return result;
  }
}

function isNumber(exp: unknown): exp is number {
  return typeof exp === 'number';
}

function isString(exp: unknown): exp is string {
  return typeof exp == 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp: any) {
  return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}
