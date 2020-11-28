import { Environment } from './Environment';

export class Eva {
  private global: Environment;

  /**
   * Creates an Evan instance with the global environment.
   */
  constructor(global = new Environment()) {
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
      return this.eval(exp[1], env) - this.eval(exp[2], env);
    }

    /**
     * Variable declaration
     */
    if (exp[0] === 'var') {
      const [, name, value] = exp;
      return env.define(name, this.eval(value));
    }

    /**
     * Variable access
     */
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplemented: ${JSON.stringify(exp, undefined, 2)}`;
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
