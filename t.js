var o = { name: 'harmony' };
Object.observe(o, function (changes) {
  console.log(changes);
})
o.name = 'ES6!'
o.kind = 'observed';
