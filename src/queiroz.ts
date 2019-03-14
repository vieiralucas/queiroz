import {log} from 'fp-ts/lib/Console';
import {array, empty} from 'fp-ts/lib/Array';
import {IO, io} from 'fp-ts/lib/IO';
import {Option} from 'fp-ts/lib/Option';
import * as assert from 'safe-assert';
import {Assertions, AssertionError} from 'safe-assert';

export {Assertions, AssertionError} from 'safe-assert';

type TestBlock = (assert: Assertions) => Option<AssertionError>;

type TestResult = {
  message: string;
  error: Option<AssertionError>;
};
const processTestResult = (tr: TestResult): IO<void> =>
  tr.error.fold(log(tr.message), err =>
    log(tr.message).chain(_ => log(err.message)),
  );

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
    log(this.description)
      .chain(_ =>
        array.sequence(io)(
          this.tests.map(test => processTestResult(test.run())),
        ),
      )
      .run();
  }
}

export const describe = (description: string): Describer => {
  return new Describer(description, empty);
};
