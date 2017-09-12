const Meta = require('./meta');

async function kickStart() {
  const mongoose = require('mongoose');

  await  mongoose.connect('mongodb://localhost/bitcore');

  const m = new Meta();
  m.idx = 0;
  await m.save();
  console.log('saved that meta');
  process.exit();
}

kickStart();
