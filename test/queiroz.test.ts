import {describe, IT, Assertions} from '../src/queiroz';

describe('yet another test runner', (it: IT) => {
  it.should('work', (assert: Assertions) => {
    return assert.ok(true);
  });

  it.should('fail', (assert: Assertions) => {
    return assert.ok(false);
  });
});
