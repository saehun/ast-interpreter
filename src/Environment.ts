/**
 * Environment: names storage.
 */
export class Environment {
  private record: Record<string, any>;

  /**
   * Create an environment with the given record.
   */
  constructor(record = {}) {
    this.record = record;
  }

  /**
   * Create a variable with the given name and value.
   */
  define<T>(name: string, value: T): T {
    this.record[name] = value;
    return value;
  }

  /**
   * Returns the value of a defined variable, or throws
   * if the variable is not defined.
   */
  lookup(name: string): any {
    if (name in this.record) {
      return this.record[name];
    }
    throw new ReferenceError(`Variable ${name} is not defined`);
  }
}
