import { TimeAgoPipe } from './time-ago.pipe';
import MockDate from 'mockdate';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    pipe = new TimeAgoPipe();
  });

  it('Seconds ago', () => {

    const MOCK_DATE_NOW = new Date(2020, 9, 11, 19, 24, 17);
    MockDate.set(MOCK_DATE_NOW);

    const date = new Date(2020, 9, 11, 19, 24, 0);

    expect(pipe.transform(date)).toEqual('17 seconds');
    MockDate.reset();
  });

  it('Minutes ago', () => {

    const MOCK_DATE_NOW = new Date(2020, 9, 11, 19, 32, 10);
    MockDate.set(MOCK_DATE_NOW);

    const date = new Date(2020, 9, 11, 19, 24, 0);

    expect(pipe.transform(date)).toEqual('8 minutes');
    MockDate.reset();
  });

});
