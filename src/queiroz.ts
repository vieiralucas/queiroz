import * as chalk from 'chalk';
import {log} from 'fp-ts/lib/Console';
import {array, empty} from 'fp-ts/lib/Array';
import {Option} from 'fp-ts/lib/Option';
import * as assert from 'safe-assert';
import {Assertions, AssertionError} from 'safe-assert';

export {Assertions, AssertionError} from 'safe-assert';

type TestBlock = (assert: Assertions) => Option<AssertionError>;

const {red, green} = chalk.default;

type TestResult = {
  message: string;
  error: Option<AssertionError>;
};
class TestCase {
  constructor(
    private readonly message: string,
    private readonly block: TestBlock,
  ) {}

  run(): TestResult {
    return {
      message: this.message,
      error: this.block(assert),
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
        const message = tr.error.fold(
          `  ${green('✓')} ${tr.message}`,
          err => `  ${red('✕')} ${tr.message}`,
        );

        return message;
      })
      .join('\n');

    const failureMessage = array
      .filterMap(trs, tr =>
        tr.error.map(error => ({error, message: tr.message})),
      )
      .map(
        ({message, error}) =>
          `${red('●')} ${red(message)}\n\n${processAssertionError(error)}`,
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
