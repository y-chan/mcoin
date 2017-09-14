const Meta = require('./meta');
const Block = require('./block');
const Tx = require('./transaction');
const Entries = require('./entry');
const Tip = require('./tip');

  const mongoose = require('mongoose');

  mongoose.connect('mongodb://localhost/bitcore');

  Block.remove({}, (err) => {
    console.log('Blocks removed');
  });

  Tx.remove({}, (err) => {
    console.log('Txs removed');
  });

  Entries.remove({}, (err) => {
    console.log('Entry removed');
  });

  Tip.remove({}, (err) => {
    console.log('Tip removed');
  });

  Meta.remove({}, async (err) => {
    console.log('Meta removed');
  });

