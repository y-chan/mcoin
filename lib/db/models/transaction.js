const mongoose = require('mongoose');
const Input = require('./input');
const Output = require('./output');
const util = require('./util');

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  hash: String,
  witnessHash: String,
  fee: Number,
  rate: Number,
  ps: Number,
  height: Number,
  block: String,
  index: Number,
  version: Number,
  flag: Number,
  lockTime: Number,
  inputs: [Input.schema],
  outputs: [Output.schema],
  size: Number,
  network: String,
  rawTx: Buffer
});

TransactionSchema.statics.saveBcoinTx = function saveBcoinTx(entry, tx, meta)  {
  const Transaction = this.model('Transaction');
  const txJSON = tx.toJSON();

  const t = new Transaction({
    hash: txJSON.hash,
    witnessHash: txJSON.witnessHash,
    fee: txJSON.fee,
    rate: txJSON.rate,
    ps: txJSON.ps,
    height: entry.height,
    block: entry.hash,
    ts: entry.ts,
    date: txJSON.date,
    index: txJSON.index,
    version: txJSON.version,
    flag: txJSON.flag,
    inputs: tx.inputs.map((input) => {
      const inputJSON = input.toJSON();
      return new Input({
        prevout: inputJSON.prevout,
        script: inputJSON.script,
        witness: inputJSON.witness,
        sequence: inputJSON.sequence,
        address: inputJSON.address
      });
    }),
    outputs: tx.outputs.map((output) => {
      const outputJSON = output.toJSON();
      return new Output({
        address: outputJSON.address,
        script: outputJSON.script,
        value: outputJSON.value
      });
    }),
    lockTime: txJSON.locktime,
    network: 'main',
    meta: meta.toRaw()
  });
  t.save((err) => {
    if (err) {
      console.log(err);
    }
  });
};

TransactionSchema.statics.deleteBcoinTx = function deleteBcoinTx(hash) {
  return this.model('Transaction').find({ hash }).remove();
};

module.exports = mongoose.model('Transaction', TransactionSchema);
