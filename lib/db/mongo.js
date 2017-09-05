const mongoose = require('mongoose');
const Meta = require('./models/meta');
// Var for now, easier to test.

function mongoDB(options) {
  if (!(this instanceof mongoDB))
    return new mongoDB(options);

  this.logger = options.logger.context('mongodb');
  // this.logger.info('Opening MongoDB...');
  console.log('Starting MongoDB...');

  this.open();
}

mongoDB.prototype.open = async function () {
  console.log('Opening MongoDB Connection');

  return mongoose.connect('mongodb://localhost/bitcore');
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

module.exports = mongoDB;
