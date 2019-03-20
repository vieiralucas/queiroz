import * as chalk from 'chalk';
import {log} from 'fp-ts/lib/Console';
import {array, empty} from 'fp-ts/lib/Array';
import {some, none} from 'fp-ts/lib/Option';
import {Assert} from './assert';
import {AssertionError} from 'safe-assert';

export {Assertions, AssertionError} from 'safe-assert';

type TestBlock = (assert: Assert) => void;

const {red, green} = chalk.default;

type TestResult = {
  message: string;
  assert: Assert;
};
class TestCase {
  constructor(
    private readonly message: string,
    private readonly block: TestBlock,
  ) {}

  run(): TestResult {
    const assert = new Assert();
    this.block(assert);

    return {
      assert,
      message: this.message,
    };
  }
}

const processAssertionError = (err: AssertionError): string =>
  [
    // FIXME: JSON.stringify is dangerous, may crash on cyclic data
    `  Expected: ${green(JSON.stringify(err.expected))}`,
    `  Actual: ${red(JSON.stringify(err.actual))}`,
  ].join('\n');

class Describer {
  constructor(
    private readonly description: string,
    private readonly tests: TestCase[],
  ) {}

  it(message: string, block: TestBlock) {
    return new Describer(this.description, [
      ...this.tests,
      new TestCase(message, block),
    ]);
  }

  run() {
    const trs = this.tests.map(test => test.run());

    const testCasesMessage = trs
      .map(tr => {
        if (tr.assert.errors.length > 0) {
          return `  ${red('✕')} ${tr.message}`;
        }

        return `  ${green('✓')} ${tr.message}`;
      })
      .join('\n');

    const failureMessage = array
      .filterMap(trs, tr => {
        if (tr.assert.errors.length > 0) {
          return some(tr);
        }

        return none;
      })
      .map(({message, assert}) =>
        assert.errors
          .map(
            error =>
              `${red('●')} ${red(message)}\n\n${processAssertionError(
                error,
              )}\n`,
          )
          .join('\n'),
      )
      .join('\n');

    log(
      `${this.description}\n${testCasesMessage}\n\n${failureMessage}`.trim(),
    ).run();
  }
}

export const describe = (description: string): Describer => {
  return new Describer(description, empty);
};
