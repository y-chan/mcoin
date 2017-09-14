const Meta = require('./meta');
const Block = require('./block');
const Tx = require('./transaction');
const Entries = require('./entry');
const Tip = require('./tip');

async function reset(cb) {
  const mongoose = require('mongoose');

  await mongoose.connect('mongodb://localhost/bitcore');

  await Block.remove({}, (err) => {
    console.log('Blocks removed');
  });

  await Tx.remove({}, (err) => {
    console.log('Txs removed');
  });

  await Entries.remove({}, (err) => {
    console.log('Entry removed');
  });

  await Tip.remove({}, (err) => {
    console.log('Tip removed');
  });

  await Meta.remove({}, async (err) => {
    console.log('Tip removed');
  });

  return cb(null);
}

module.exports = {
  reset
};
