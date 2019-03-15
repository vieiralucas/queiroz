import {describe} from '../src/queiroz';

const car = {
  engine: 1,
  wheels: 4,
};

describe('A car')
  .it('should have 4 wheels', assert => assert.equal(car.wheels, 4))
  .it('should have 1 engine', assert => assert.equal(car.engine, 1))
  .it('should be a car', assert => assert.deepEqual(car, 'lol'))
  .run();
