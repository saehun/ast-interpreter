/**
 * Environment: names storage.
 */
export class Environment {
  private record: Record<string, any>;
  parent: Environment | undefined;

  /**
   * Create an environment with the given record.
   */
  constructor(record = {}, parent?: Environment) {
    this.record = record;
    this.parent = parent;
  }

  /**
   * Create a variable with the given name and value.
   */
  define<T>(name: string, value: T): T {
    this.record[name] = value;
    return value;
  }

  /**
   * Updates an existing variable.
   */
  assign<T>(name: string, value: T): T {
    this.resolve(name).record[name] = value;
    return value;
  }

  /**
   * Returns the value of a defined variable, or throws
   * if the variable is not defined.
   */
  lookup(name: string): any {
    return this.resolve(name).record[name];
  }

  /**
   * Return specific environment in which a variable is defined, or
   * throw if a variable is not defined
   */
  resolve(name: string): any {
    if (name in this.record) {
      return this;
    }
    if (this.parent === undefined) {
      throw new ReferenceError(`Variable '${name}' is not defined`);
    } else {
      return this.parent.resolve(name);
    }
  }
}
