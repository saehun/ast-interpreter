import { Environment } from './Environment';

export class Eva {
  private global: Environment;

  /**
   * Creates an Evan instance with the global environment.
   */
  constructor(global = GlobalEnvironment) {
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
      return this.evalBlock(exp, new Environment({}, env));
    }

    /**
     * Variable access
     */
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    /**
     * if-expression
     */
    if (exp[0] === 'if') {
      const [, condition, consequent, alternate] = exp;
      if (this.eval(condition, env)) {
        return this.eval(consequent, env);
      } else {
        return this.eval(alternate, env);
      }
    }

    /**
     * while-expression
     */
    if (exp[0] === 'while') {
      const [, condition, body] = exp;
      let result;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }
      return result;
    }

    /**
     * Function declaration: (def square (x) (* x x))
     */
    if (exp[0] === 'def') {
      const [, name, params, body] = exp;

      const fn = {
        params,
        body,
        env, // Closure
      };

      return env.define(name, fn);
    }

    /**
     * Function calls
     */
    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map(arg => this.eval(arg, env));

      // 1. Native function:
      if (typeof fn === 'function') {
        return fn(...args);
      }

      // 2. User defined function
      if (typeof fn === 'object') {
        const activationRecord: Record<string, any> = {};
        fn.params.forEach((param: any, index: number) => {
          activationRecord[param] = args[index];
        });

        const activationEnv = new Environment(
          activationRecord,
          fn.env // Lexical scope. if 'env' passed it will become dynamic scope
        );

        return this.evalFunctionBody(fn.body, activationEnv);
      }
    }

    throw `Unimplemented: ${JSON.stringify(exp, undefined, 2)}`;
  }

  private evalFunctionBody(body: any, env: Environment): any {
    if (body[0] === 'begin') {
      return this.evalBlock(body, env);
    } else {
      return this.eval(body, env);
    }
  }

  private evalBlock(exp: any, env: Environment) {
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
  return typeof exp === 'string' && /^[+\-/=*><>a-zA-Z_]*$/.test(exp);
}

const GlobalEnvironment = new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: '0.1',

  /**
   * Arithmatic Operation
   */
  '+'(op1: number, op2: number) {
    return op1 + op2;
  },
  '-'(op1: number, op2?: number) {
    if (op2 === undefined) {
      return -op1;
    }
    return op1 - op2;
  },
  '*'(op1: number, op2: number) {
    return op1 * op2;
  },
  '/'(op1: number, op2: number) {
    return op1 / op2;
  },
  /**
   * Comparison Operation
   */
  '='(op1: number, op2: number) {
    return op1 === op2;
  },
  '>'(op1: number, op2: number) {
    return op1 > op2;
  },
  '>='(op1: number, op2: number) {
    return op1 >= op2;
  },
  '<'(op1: number, op2: number) {
    return op1 < op2;
  },
  '<='(op1: number, op2: number) {
    return op1 <= op2;
  },

  /**
   *
   */
  print: console.log,
});
