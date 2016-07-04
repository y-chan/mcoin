/*!
 * fees.js - fee estimation for bcoin
 * Copyright (c) 2014-2016, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 * Ported from:
 * https://github.com/bitcoin/bitcoin/blob/master/src/policy/fees.cpp
 */

'use strict';

var utils = require('./utils');
var assert = require('assert');
var fs;

if (!utils.isBrowser)
  fs = require('f' + 's');

function Logger(options) {
  if (!(this instanceof Logger))
    return new Logger(options);

  if (!options)
    options = {};

  if (typeof options === 'string')
    options = { level: options };

  this.level = Logger.levels.warning;
  this.colors = options.colors !== false;
  this.file = options.file;
  this.stream = null;

  if (!process.stdout || !process.stdout.isTTY)
    this.colors = false;

  if (options.level != null)
    this.setLevel(options.level);
}

Logger.prototype.setLevel = function setLevel(level) {
  level = Logger.levels[level];
  assert(level != null, 'Invalid log level.');
  this.level = level;
};

Logger.levels = {
  none: 0,
  error: 1,
  warning: 2,
  info: 3,
  debug: 4
};

Logger.colors = {
  error: '1;31',
  warning: '1;33',
  info: '94',
  debug: '90'
};

Logger.prototype.error = function error(err) {
  var i, args, msg;

  if (this.level < Logger.levels.error)
    return;

  if (err instanceof Error)
    return this._error(err);

  args = new Array(arguments.length);

  for (i = 0; i < args.length; i++)
    args[i] = arguments[i];

  this._log('error', args);
};

Logger.prototype.warning = function warning() {
  var i, args, msg;

  if (this.level < Logger.levels.warning)
    return;

  args = new Array(arguments.length);

  for (i = 0; i < args.length; i++)
    args[i] = arguments[i];

  this._log('warning', args);
};

Logger.prototype.info = function info() {
  var i, args, msg;

  if (this.level < Logger.levels.info)
    return;

  args = new Array(arguments.length);

  for (i = 0; i < args.length; i++)
    args[i] = arguments[i];

  this._log('info', args);
};

Logger.prototype.debug = function debug() {
  var i, args, msg;

  if (this.level < Logger.levels.debug)
    return;

  args = new Array(arguments.length);

  for (i = 0; i < args.length; i++)
    args[i] = arguments[i];

  this._log('debug', args);
};

Logger.prototype._log = function _log(level, args) {
  var prefix = '[' + level + '] ';
  var color, msg;

  if (utils.isBrowser) {
    msg = typeof args[0] !== 'object'
      ? utils.format(args, false)
      : args[0];

    if (level === 'error')
      console.error(msg);
    else
      console.log(msg);

    return;
  }

  if (this.colors) {
    color = Logger.colors[level];
    prefix = '\x1b[' + color + 'm' + prefix + '\x1b[m';
  }

  msg = prefix + utils.format(args, this.colors);

  if (level === 'error')
    process.stderr.write(msg + '\n');
  else
    process.stdout.write(msg + '\n');

  if (this.file) {
    if (this.colors)
      msg = prefix + utils.format(args, false);
    this._write(msg);
  }
};

Logger.prototype._error = function error(err) {
  var msg;

  if (utils.isBrowser) {
    console.error(err);
    return;
  }

  msg = (err.message + '').replace(/^ *Error: */, '');

  this._log('error', [msg]);

  if (this.file)
    this._write(err.stack + '');
};

Logger.prototype._write = function write(msg) {
  if (!this.stream) {
    utils.mkdir(this.file, true);
    this.stream = fs.createWriteStream(this.file, { flags: 'a' });
  }

  this.stream.write(process.pid + ' (' + utils.date() + '): ' + msg + '\n');
};

Logger.prototype.memory = function memory() {
  var mem;

  if (!process.memoryUsage)
    return;

  mem = process.memoryUsage();

  this.debug('Memory: rss=%dmb, js-heap=%d/%dmb native-heap=%dmb',
    utils.mb(mem.rss),
    utils.mb(mem.heapUsed),
    utils.mb(mem.heapTotal),
    utils.mb(mem.rss - mem.heapTotal));
};

module.exports = Logger;
