const Meta = require('./meta');
const Block = require('./block');
const Tx = require('./transaction');
const Entry = require('./entry');
const StateCache = require('./stateCache');
const Tip = require('./tip');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bcoin');

async function reset() {
  await Block.remove({});
  await Tx.remove({});
  await Entry.remove({});
  await Tip.remove({});
  await Meta.remove({});
  await StateCache.remove({});
  console.log('db cleared');
  mongoose.disconnect();
}

reset();
