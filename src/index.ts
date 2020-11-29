import { Environment } from './Environment';
import { Transformer } from './Transformer';
const evaParser = require('../parser/evaParser');
import * as fs from 'fs';

export class Eva {
  private global: Environment;
  private transformer: Transformer;

  /**
   * Creates an Evan instance with the global environment.
   */
  constructor(global = GlobalEnvironment) {
    this.global = global;
    this.transformer = new Transformer();
  }

  /**
   * Evaluates global code wrapping into a block.
   */
  evalGlobal(exp: any): any {
    return this.evalBody(exp, this.global);
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
     * Increment
     */
    if (exp[0] === '++') {
      return this.eval(this.transformer.transformIncrement(exp), env);
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
      const [, ref, value] = exp;

      // Assignment to a property:
      if (ref[0] === 'prop') {
        const [, instance, propName] = ref;
        const instanceEnv = this.eval(instance, env);
        return instanceEnv.define(propName, this.eval(value, env));
      }

      // Simple assignment:
      return env.assign(ref, this.eval(value, env));
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

    if (exp[0] === 'switch') {
      return this.eval(this.transformer.transformSwitchToIf(exp), env);
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
     * for-expression
     */
    if (exp[0] === 'for') {
      return this.eval(this.transformer.transformForToWhile(exp), env);
    }

    /**
     * Function declaration: (def square (x) (* x x))
     */
    if (exp[0] === 'def') {
      return this.eval(this.transformer.transformDefToVarLambda(exp), env);
    }

    /**
     * Lambda function: (lambda (x) (* x x))
     */
    if (exp[0] === 'lambda') {
      const [, params, body] = exp;
      return {
        params,
        body,
        env,
      };
    }

    /**
     * Class declaration: (class <name> <parent> <body>)
     */
    if (exp[0] === 'class') {
      const [, name, parent, body] = exp;

      const parentEnv = this.eval(parent, env) || env;
      const classEnv = new Environment({}, parentEnv);

      this.evalBody(body, classEnv);

      return env.define(name, classEnv);
    }

    /**
     * Class instanciation: (new <Class> <Argument>...)
     */
    if (exp[0] === 'new') {
      const [, className, ...args] = exp;

      const classEnv = this.eval(className);
      // An instance of a class is an environment
      // The `parent` component of the instance environment
      // is set to its class.
      const instanceEnv = new Environment({}, classEnv);
      const constructorArgs = args.map((arg: any) => this.eval(arg, env));

      this.callUserDefinedFunction(
        classEnv.lookup('constructor'),
        [instanceEnv, ...constructorArgs] // (constructor instance arg1 arg2 ...)
      );
      return instanceEnv;
    }

    /**
     * Super expressions: (super <class>)
     */
    if (exp[0] === 'super') {
      const [, className] = exp;
      return this.eval(className, env).parent;
    }

    /**
     * Property access: (prop <instance> <name>)
     */
    if (exp[0] === 'prop') {
      const [, instance, name] = exp;
      const instanceEnv = this.eval(instance, env);
      return instanceEnv.lookup(name);
    }

    /**
     * Module declaration
     */
    if (exp[0] === 'module') {
      const [, name, body] = exp;
      const moduleEnv = new Environment({}, env);
      this.evalBody(body, moduleEnv);

      return env.define(name, moduleEnv);
    }

    /**
     * Module Import: (import <module-name>)
     */
    if (exp[0] === 'import') {
      const [, name] = exp;

      const source = fs.readFileSync(`./modules/${name}.eva`, 'utf-8');
      const body = evaParser.parse(`(begin ${source})`);

      return this.eval(['module', name, body], this.global);
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
      return this.callUserDefinedFunction(fn, args);
    }

    throw `Unimplemented: ${JSON.stringify(exp, undefined, 2)}`;
  }

  private evalBody(body: any, env: Environment): any {
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

  private callUserDefinedFunction(fn: any, args: any[]) {
    const activationRecord: Record<string, any> = {};
    fn.params.forEach((param: any, index: number) => {
      activationRecord[param] = args[index];
    });

    const activationEnv = new Environment(
      activationRecord,
      fn.env // Lexical scope. if 'env' passed it will become dynamic scope
    );

    return this.evalBody(fn.body, activationEnv);
  }
}

function isNumber(exp: unknown): exp is number {
  return typeof exp === 'number';
}

function isString(exp: unknown): exp is string {
  return typeof exp == 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp: any) {
  return typeof exp === 'string' && /^[+\-/=*><>a-zA-Z_0-9]*$/.test(exp);
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
