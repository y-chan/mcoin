const mongoose = require('mongoose');
const Block    = require('./models/block');
const Meta     = require('./models/meta');
const Entry    = require('./models/entry');
const Tip      = require('./models/tip');

function mongoDB(options) {
  if (!(this instanceof mongoDB))
    return new mongoDB(options);

  // this.logger.info('Opening MongoDB...');
  console.log('Starting MongoDB...');

  this.open();
}

mongoDB.prototype.open = async function () {
  console.log('Opening MongoDB Connection');

  return mongoose.connect('mongodb://localhost/bitcore');
};

mongoDB.prototype.close = function() {
  mongoose.disconnect(() => {
    console.log('Mongoose connection with DB disconnected through app termination');
    process.exit(0);
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

mongoDB.prototype.setChainOptions = async function(options)  {
  return await Meta.setChainOptions(options);
};

mongoDB.prototype.getChainOptions = async function()  {
  return await Meta.getChainOptions();
};

mongoDB.prototype.saveEntry = async function(hash, entry) {
  return Entry.saveEntry(hash, entry);
};

mongoDB.prototype.getEntry = async function(hash) {
  return Entry.getEntry(hash);
};

mongoDB.prototype.getBlockHeightByHash = async function getBlockHeightByHash(hash) {
  return Block.getBlockHeightByHash(hash);
};

mongoDB.prototype.updateNextBlock = function(hash, nextHash) {
  return Block.updateNextBlock(hash, nextHash);
};

mongoDB.prototype.saveTip = async function saveTip(hash, height) {
  return Tip.saveTip(hash, height);
};

mongoDB.prototype.removeTip = async function removeTip(hash) {
  return Tip.removeTip(hash);
};

mongoDB.prototype.saveBcoinBlock = function saveBcoinBlock(entry, block) {
  return Block.saveBcoinBlock(entry, block);
};

mongoDB.prototype.getNextHash = function getNextHash(hash)  {
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

module.exports = mongoDB;
