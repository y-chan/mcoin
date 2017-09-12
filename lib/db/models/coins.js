const mongoose = require('mongoose');
const util = require('./util');

const Schema = mongoose.Schema;

const CoinSchema = new Schema({
  hash: String
});

CoinSchema.statics.saveCoins = function saveCoins() {

};

module.exports = mongoose.model('Coin', CoinSchema);
