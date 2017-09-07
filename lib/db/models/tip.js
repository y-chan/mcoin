const mongoose = require('mongoose');
const util = require('./util');

const Schema = mongoose.Schema;

const TipSchema = new Schema({
  hash: String,
  tipHeight: Buffer
});

TipSchema.statics.saveTip = function saveTip(hash, height) {
  const Tip = this.model('Tip');

  return new Tip({
    hash: util.revHex(hash.toString('hex')),
    tipHeight: height
  }).save();
};

TipSchema.statics.removeTip = function removeTip(hash) {
  return this.model('Tip').remove({ hash });
};

module.exports = mongoose.model('Tip', TipSchema);
