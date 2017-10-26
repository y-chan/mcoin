const assert = require('assert');

function Queue() {
  if (!(this instanceof Queue))
    return new Queue();
}

Queue.prototype.batch = function batch(ops, options, callback) {
  if (!callback) {
    callback = options;
    options = null;
  }

  const b = new Batch(this, options);

  if (ops) {
    b.ops = ops;
    b.write(callback);
    return undefined;
  }

  return b;
};

/**
 * Batch
 * @constructor
 * @ignore
 * @private
 * @param {MemDB} db
 * @param {Object?} options
 */

function Batch(db, options) {
  this.options = options || {};
  this.ops = [];
  this.db = db;
  this.written = false;
}

/**
 * Insert a record.
 * @param {Buffer|String} key
 * @param {Buffer} value
 */

Batch.prototype.put = function put(op) {
  this.ops.push(op);
  return this;
};

/**
 * Remove a record.
 * @param {Buffer|String} key
 */

Batch.prototype.del = function del(key) {
  return this;
};

/**
 * Commit the batch.
 * @param {Function} callback
 */

Batch.prototype.write = function write(callback) {
  if (this.written) {
    setImmediate(() => callback(new Error('Already written.')));
    return this;
  }

  for (const op of this.ops) {
    const o = op();
    o();
  }

  this.ops = [];
  this.written = true;

  setImmediate(callback);

  return this;
};

/**
 * Clear batch of all ops.
 */

Batch.prototype.clear = function clear() {
  assert(!this.written, 'Already written.');
  this.ops = [];
  return this;
};

Batch.prototype.batch = function batch(ops, options, callback) {
  if (!callback) {
    callback = options;
    options = null;
  }

  const b = new Batch(this, options);

  if (ops) {
    b.ops = ops;
    b.write(callback);
    return undefined;
  }

  return b;
};

/**
 * Batch Operation
 * @constructor
 * @ignore
 * @private
 * @param {String} type
 * @param {Buffer} key
 * @param {Buffer|null} value
 */

function BatchOp(type, key, value) {
  this.type = type;
  this.key = key;
  this.value = value;
}

module.exports = Queue;
