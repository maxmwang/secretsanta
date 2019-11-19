var _ = require('lodash');

function randchoice(list) {
  var n = list.length;
  return list[Math.floor(Math.random() * n)];
}

function singlematch(names) {
  var n = names.length;

  var santas = {};
  names.forEach(n => { santas[n] = undefined; });

  var curr = randchoice(names);
  var assigned = [];
  var visited = [];

  while (visited.length < n) {
    visited.push(curr);
    var available_targets = names;
    available_targets = _.filter(available_targets, n => n != curr); // remove self
    available_targets = _.filter(available_targets, n => !assigned.includes(n)); // remove already assigned in this iteration

    var target;
    if (available_targets.length == 2) { // need to pick right one to avoid leaving odd one out
      target = santas[available_targets[0]] == undefined ? available_targets[0] : available_targets[1];
    } else {
      target = randchoice(available_targets);
    }
    santas[curr] = target;
    assigned.push(target);

    if (visited.includes(target)) {
      curr = randchoice(_.filter(names, n => !visited.includes(n)));
    } else {
      curr = target;
    }
  }

  return santas
}

function match(names, n_santas) {
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
      matches = singlematch(names);
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
  match: (names, n_santas) => match(names, n_santas),
}