import {describe} from '../src/queiroz';

describe('yet another test runner')
  .it('should work', assert => assert.ok(true))
  .it('should fail', assert => assert.ok(false))
  .run();
