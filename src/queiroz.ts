import {Option} from 'fp-ts/lib/Option';
import * as assert from 'safe-assert';
import {Assertions, AssertionError} from 'safe-assert';

export {Assertions, AssertionError} from 'safe-assert';

type TestBlock = (assert: Assertions) => Option<AssertionError>;
class TestCase {
  constructor(
    private readonly message: string,
    private readonly block: TestBlock,
  ) {}

  run() {
    this.block(assert).foldL(
      () => {
        console.log(`should ${this.message}`);
      },
      error => {
        console.error(`should ${this.message}`);
        console.error(error.message);
      },
    );
  }
}

export class IT {
  private tests: TestCase[] = [];

  should(message: string, block: TestBlock) {
    this.tests.push(new TestCase(message, block));
  }

  run() {
    this.tests.forEach(test => test.run());
  }
}

export const describe = (description: string, block: Function): void => {
  const it = new IT();
  block(it);

  console.log(description);
  it.run();
};
