const Meta = require('./meta');
const Block = require('./block');
const Tx = require('./transaction');
const Entries = require('./entry');
const Tip = require('./tip');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bcoin-test');

return Block.remove({}, (err) => {
  console.log('Blocks removed');
}).then(() => {
  Tx.remove({}, (err) => {
    console.log('Txs removed');
  });
}).then(() => {
  Entries.remove({}, (err) => {
    console.log('Entry removed');
  });
}).then(() => {
  Tip.remove({}, (err) => {
    console.log('Tip removed');
  });
}).then(() => {
  Meta.remove({}, async (err) => {
    console.log('Meta removed');
  });
});

