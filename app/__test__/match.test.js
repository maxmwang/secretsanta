const { match } = require("../match");

describe('match test', () => {
  test('simple 2 people, single santa', () => {
    const names = ['a', 'b'];
    const n_santas = 1;
    const restrictions = {'a': ['c']};
    const santas = match(names, n_santas, restrictions);

    expect(santas['a'].length).toEqual(1);
    expect(santas['a'][0]).toEqual('b');

    expect(santas['b'].length).toEqual(1);
    expect(santas['b'][0]).toEqual('a');
  });

  test('simple 3 people, single santa, one restriction', () => {
    const names = ['a', 'b', 'c'];
    const n_santas = 1;
    const restrictions = {'a': ['c']};
    const santas = match(names, n_santas, restrictions);

    expect(santas['a'].length).toEqual(1);
    expect(santas['a'][0]).toEqual('b');

    expect(santas['b'].length).toEqual(1);
    expect(santas['b'][0]).toEqual('c');

    expect(santas['c'].length).toEqual(1);
    expect(santas['c'][0]).toEqual('a');
  });

  test('5 people, double santas, two restrictions', () => {
    const names = ['y', 'g', 'a', 'b', 'm'];
    const n_santas = 2;
    const restrictions = {'y': ['g'], 'g': ['y']};
    const santas = match(names, n_santas, restrictions);

    for (let santa in santas) {
      expect(santas[santa].length).toEqual(2);
    }
  });
});