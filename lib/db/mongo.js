const mongoose = require('mongoose');
const Block    = require('./models/block');
const Meta     = require('./models/meta');
const Entry    = require('./models/entry');
const Tip      = require('./models/tip');
const Tx       = require('./models/transaction');

function mongoDB(options) {
  if (!(this instanceof mongoDB))
    return new mongoDB(options);

  console.log('Starting MongoDB...');

  this.dbhost = options.dbhost;
  this.dbname = options.dbname;
  this.connectionString = `mongodb://${this.dbhost}/${this.dbname}`;
}

mongoDB.prototype.open = async function () {
  console.log('Opening MongoDB Connection');

  return mongoose.connect(this.connectionString);
};

mongoDB.prototype.close = function() {
  mongoose.disconnect(() => {
    console.log('Mongoose connection with DB disconnected through app termination');
  });
};

mongoDB.prototype.getTipHash = async function() {
  return await Meta.getTipHash();
};

mongoDB.prototype.setTipHash = function(hash, cb) {
  return Meta.setTipHash(hash, (err) => {
    if (err) {
      return cb(err);
    }
  });
};

mongoDB.prototype.setChainOptions = async function setChainOptions(options)  {
  return await Meta.setChainOptions(options);
};

mongoDB.prototype.getChainOptions = async function getChainOptions()  {
  return await Meta.getChainOptions();
};

mongoDB.prototype.saveEntry = async function saveEntry(hash, height, entry) {
  return Entry.saveEntry(hash, height, entry);
};

mongoDB.prototype.getEntryByHash = async function getEntryByHash(hash) {
  return Entry.getEntryByHash(hash);
};

mongoDB.prototype.getEntryByHeight = async function getEntryByHeight(height) {
  return Entry.getEntryByHeight(height);
};

mongoDB.prototype.getBlockHeightByHash = async function getBlockHeightByHash(hash) {
  return Block.getBlockHeightByHash(hash);
};

mongoDB.prototype.getBlockHashByHeight = async function getBlockHashByHeight(height) {
  return Block.getBlockHashByHeight(height);
};

mongoDB.prototype.updateNextBlock = function updateNextBlock(hash, nextHash) {
  return Block.updateNextBlock(hash, nextHash);
};

mongoDB.prototype.getNextHash = function getNextHash(hash)  {
  return Block.getNextHash(hash);
};

mongoDB.prototype.saveTip = async function saveTip(hash, height) {
  return Tip.saveTip(hash, height);
};

mongoDB.prototype.removeTip = async function removeTip(hash) {
  return Tip.removeTip(hash);
};

mongoDB.prototype.getTips = async function getTips()  {
  return Tip.getTips();
};

mongoDB.prototype.saveBcoinBlock = function saveBcoinBlock(entry, block) {
  return Block.saveBcoinBlock(entry, block);
};

mongoDB.prototype.getNextHash = function getNextHash(hash) {
  return Block.getNextHash(hash);
};

mongoDB.prototype.getBlockByHeight = function getBlockByHeight(height) {
  return Block.byHeight(height);
};

mongoDB.prototype.setDeploymentBits = function setDeploymentBits(bits) {
  return Meta.setDeploymentBits(bits);
};

mongoDB.prototype.getDeploymentBits = function getDeploymentBits() {
  return Meta.getDeploymentBits();
};

mongoDB.prototype.getRawBlock = function getRawBlock(hash) {
  return Block.getRawBlock(hash);
};

mongoDB.prototype.saveBcoinTx = function saveBcoinTx(entry, tx, meta) {
  return Tx.saveBcoinTx(entry, tx, meta);
};

mongoDB.prototype.deleteBcoinTx = function deleteBcoinTx(hash) {
  return Tx.deleteBcoinTx(hash);
};

module.exports = mongoDB;
