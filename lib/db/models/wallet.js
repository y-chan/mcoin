'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Wallet', WalletSchema);
