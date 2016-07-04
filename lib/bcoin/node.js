/*!
 * node.js - node object for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2016, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

var bcoin = require('./env');
var AsyncObject = require('./async');
var utils = require('./utils');
var Profiler;

/**
 * Base class from which every other
 * Node-like object inherits.
 * @exports Node
 * @constructor
 * @abstract
 * @param {Object} options
 */

function Node(options) {
  if (!(this instanceof Node))
    return new Node(options);

  AsyncObject.call(this);

  options = this.parseOptions(options);

  this.options = options;
  this.network = bcoin.network.get(options.network);
  this.prefix = options.prefix;

  this.logger = options.logger;
  this.db = options.db;
  this.profiler = null;
  this.mempool = null;
  this.pool = null;
  this.chain = null;
  this.miner = null;
  this.walletdb = null;
  this.wallet = null;

  if (!this.logger) {
    this.logger = new bcoin.logger({
      level: options.logLevel || 'none',
      file: options.logFile
    });
  }

  if (options.profile && !utils.isBrowser) {
    Profiler = require('./prof' + 'iler');
    this.profiler = new Profiler(this.prefix);
  }

  this._bound = [];

  this.__init();
}

utils.inherits(Node, AsyncObject);

/**
 * Initialize node.
 * @private
 */

Node.prototype.__init = function _init() {
  var self = this;

  this._bind(bcoin.time, 'offset', function(offset) {
    self.logger.info('Time offset: %d (%d minutes).', offset, offset / 60 | 0);
  });

  this._bind(bcoin.time, 'sample', function(sample, total) {
    self.logger.debug('Added time data: samples=%d, offset=%d (%d minutes).',
      total, sample, sample / 60 | 0);
  });

  this._bind(bcoin.time, 'mismatch', function() {
    self.logger.warning('Please make sure your system clock is correct!');
  });

  if (!bcoin.workerPool)
    return;

  this._bind(bcoin.workerPool, 'spawn', function(child) {
    self.logger.info('Spawning worker process: %d.', child.id);
  });

  this._bind(bcoin.workerPool, 'exit', function(code, child) {
    self.logger.warning('Worker %d exited: %s.', child.id, code);
  });

  this._bind(bcoin.workerPool, 'error', function(err, child) {
    if (child) {
      self.logger.error('Worker %d error: %s', child.id, err.message);
      return;
    }
    self.emit('error', err);
  });
};

/**
 * Parse options object.
 * @param {Object} options
 * @returns {Object}
 */

Node.prototype.parseOptions = function parseOptions(options) {
  if (!options)
    options = {};

  options = utils.merge({}, options);

  if (process.env.BCOIN_PREFIX != null)
    options.prefix = process.env.BCOIN_PREFIX;

  if (process.env.BCOIN_DB != null)
    options.db = process.env.BCOIN_DB;

  if (process.env.BCOIN_LOGLEVEL != null)
    options.logLevel = process.env.BCOIN_LOGLEVEL;

  if (process.env.BCOIN_LOGFILE != null) {
    if (process.env.BCOIN_LOGFILE === '0'
        || process.env.BCOIN_LOGFILE === '1') {
      options.logFile = +process.env.BCOIN_LOGFILE === 1;
    } else {
      options.logFile = process.env.BCOIN_LOGFILE;
    }
  }

  if (process.env.BCOIN_SEED != null)
    options.preferredSeed = process.env.BCOIN_SEED;

  if (process.env.BCOIN_PROFILE != null)
    options.profile = +process.env.BCOIN_PROFILE === 1;

  if (!options.prefix)
    options.prefix = utils.HOME + '/.bcoin';

  if (!options.db)
    options.db = 'memory';

  if (options.logFile && typeof options.logFile !== 'string') {
    options.logFile = options.prefix;
    if (options.network !== 'main')
      options.logFile += '/' + options.network;
    options.logFile += '/debug.log';
  }

  options.prefix = utils.normalize(options.prefix);

  options.logFile = options.logFile
    ? utils.normalize(options.logFile)
    : null;

  return options;
};

/**
 * Create a database location from a name.
 * @private
 * @param {String} name
 * @returns {String}
 */

Node.prototype.location = function _location(name) {
  var location = this.prefix;
  if (this.network.type !== 'main')
    location += '/' + this.network.type;
  location += '/' + name;
  return location;
};

/**
 * Bind to an event on `obj`, save listener for removal.
 * @private
 * @param {EventEmitter} obj
 * @param {String} event
 * @param {Function} listener
 */

Node.prototype._bind = function _init(obj, event, listener) {
  this._bound.push([obj, event, listener]);
  obj.on(event, listener);
};

/**
 * Unbind events on all global object.
 * @private
 */

Node.prototype._unbind = function _unbind() {
  var i, bound;

  for (i = 0; i < this._bound.length; i++) {
    bound = this._bound[i];
    bound[0].removeListener(bound[1], bound[2]);
  }

  this._bound.length = 0;
};

/*
 * Expose
 */

module.exports = Node;
