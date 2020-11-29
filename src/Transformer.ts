/**
 * AST Transformer
 */
export class Transformer {
  /**
   * Translates 'def'-expression (function declaration)
   * into a variable declaration with a lambda expression.
   */
  transformDefToVarLambda(defExp: any): any {
    const [, name, params, body] = defExp;
    return ['var', name, ['lambda', params, body]];
  }

  /**
   * Translates 'switch'-expression to nested 'if'-expressions
   */
  transformSwitchToIf(switchExp: any): any {
    const [, ...cases] = switchExp;
    const rootExp: any = ['if'];
    let currentExp = rootExp;
    for (let i = 0; i < cases.length - 1; i++) {
      const [cond, block] = cases[i];

      currentExp[1] = cond;
      currentExp[2] = block;

      const [nextCond, nextBlock] = cases[i + 1];
      currentExp[3] = nextCond === 'else' ? nextBlock : ['if'];

      currentExp = currentExp[3];
    }
    return rootExp;
  }

  /**
   * Translates 'for'-expression to 'while'-expression
   * (for <init> <condition> <modifier> <exp>)
   */
  transformForToWhile(forExp: any): any {
    const [, init, condition, modifier, exp] = forExp;
    return ['begin', init, ['while', condition, ['begin', exp, modifier]]];
  }

  /**
   * Translates '++' to 'add and set' expression
   * (++ identifier)
   */
  transformIncrement(incExp: any): any {
    const [, identifier] = incExp;
    return ['set', identifier, ['+', identifier, 1]];
  }
}
