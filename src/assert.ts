import {AssertionError} from 'safe-assert';
import * as assert from 'safe-assert';

export class Assert {
  public readonly errors: AssertionError[];

  constructor() {
    this.errors = [];
  }

  deepEqual(
    actual: unknown,
    expected: unknown,
    message?: string | Error | undefined,
  ) {
    assert.deepEqual(actual, expected, message).foldL(
      () => {},
      err => {
        this.errors.push(err);
      },
    );
  }

  deepStrictEqual(
    actual: unknown,
    expected: unknown,
    message?: string | Error | undefined,
  ) {
    assert.deepStrictEqual(actual, expected, message).foldL(
      () => {},
      err => {
        this.errors.push(err);
      },
    );
  }

  equal(
    actual: unknown,
    expected: unknown,
    message?: string | Error | undefined,
  ) {
    assert.equal(actual, expected, message).foldL(
      () => {},
      err => {
        this.errors.push(err);
      },
    );
  }

  notDeepEqual(
    actual: unknown,
    expected: unknown,
    message?: string | Error | undefined,
  ) {
    assert.notDeepEqual(actual, expected, message).foldL(
      () => {},
      err => {
        this.errors.push(err);
      },
    );
  }

  notDeepStrictEqual(
    actual: unknown,
    expected: unknown,
    message?: string | Error | undefined,
  ) {
    assert.notDeepStrictEqual(actual, expected, message).foldL(
      () => {},
      err => {
        this.errors.push(err);
      },
    );
  }

  notEqual(
    actual: unknown,
    expected: unknown,
    message?: string | Error | undefined,
  ) {
    assert.notEqual(actual, expected, message).foldL(
      () => {},
      err => {
        this.errors.push(err);
      },
    );
  }

  notStrictEqual(
    actual: unknown,
    expected: unknown,
    message?: string | Error | undefined,
  ) {
    assert.notStrictEqual(actual, expected, message).foldL(
      () => {},
      err => {
        this.errors.push(err);
      },
    );
  }

  strictEqual(
    actual: unknown,
    expected: unknown,
    message?: string | Error | undefined,
  ) {
    assert.strictEqual(actual, expected, message).foldL(
      () => {},
      err => {
        this.errors.push(err);
      },
    );
  }

  throws(
    block: Function,
    error: RegExp | Function | Object | Error,
    message?: string | Error,
  ) {
    assert.throws(block, error, message).foldL(
      () => {},
      err => {
        this.errors.push(err);
      },
    );
  }
}
