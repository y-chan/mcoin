const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EntrySchema = new Schema({
  hash: String,
  data: Buffer
});

EntrySchema.statics.saveEntry = function saveEntry(hash, entry) {
  const Entry = this.model('Entry');

  return new Entry({
    'hash': hash.toString('hex'),
    'data': Buffer.from(entry, 'hex')
  }).save();
};

EntrySchema.statics.getEntry = function getEntry(hash) {
  return new Promise((res, rej) => {
    return this.model('Entry').findOne(
      { hash: hash },
      (err, entry) => {
        if (err) {
          rej(err);
        }
        res(entry.data);
      }
    );
  });
};

module.exports = mongoose.model('Entry', EntrySchema);
