var _ = require('lodash');

function randchoice(list) {
  var n = list.length;
  return list[Math.floor(Math.random() * n)];
}

function singlematch_helper(names, restrictions, curr, assigned, santas) {
  if (assigned.length === names.length) {
    return santas;
  }

  var available_targets = names;
  available_targets = _.filter(available_targets, n => n != curr); // remove self
  available_targets = _.filter(available_targets, n => !assigned.includes(n)); // remove already assigned in this iteration
  available_targets = _.filter(available_targets, n => !restrictions[curr]?.includes(n)) // remove restrictions
  if (available_targets.length === 0) {
    return undefined;
  }

  var shuffled = _.shuffle(available_targets);
  for (let target of shuffled) {
    let next = target;
    const visited = [...Object.keys(santas), curr];
    if (visited.includes(target)) {
      next = randchoice(_.filter(names, n => !visited.includes(n)));
    }
    const result = singlematch_helper(names, restrictions, next, [...assigned, target], {...santas, [curr]: target});
    if (result !== undefined) {
      return result;
    }
  }

  return undefined;
}

/**
names: an array of participants. e.g. ['a', 'b', 'c']
restrictions: a map from particpant to a list of participants
they should not be santa for. e.g. {a: ['c']} -- a will not be the santa for c

return value: a map from santa to recipient
e.g. {a: b, b: c, c: a}
**/
function singlematch(names, restrictions) {
  var curr = randchoice(names);
  return singlematch_helper(names, restrictions, curr, [], {});
}

/**
names: an array of participants. e.g. ['a', 'b', 'c']
n_santas: the number of santas each participants are
restrictions: a map from particpant to a list of participants
they should not be santa for. e.g. {a: ['c']} -- a will not be the santa for c

return value: a map from santa to a list of recipients
e.g. {a: ['b'], b: ['c'], c: ['a']}
a is the santa for b
b is the santa for c
c is the santa for a
**/
function match(names, n_santas, restrictions) {
  var n = names.length;

  var santas = {};
  names.forEach(n => {
    santas[n] = [];
  });

  for (var i = 0; i < n_santas; i++) {
    var matches;
    var accepted = false;
    while (!accepted) {
      accepted = true;
      matches = singlematch(names, restrictions);
      for (var santa in matches) {
        var target = matches[santa];
        if (santas[santa].includes(target)) {
          accepted = false;
          break;
        }
      }
    }
    Object.keys(matches).forEach(santa => {
      santas[santa].push(matches[santa]);
    });
  }

  return santas;
}

module.exports = {
  match: match,
}