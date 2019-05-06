'use strict';

const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const str = JSON.stringify;
const env = process.env;

module.exports = {
  target: 'web',
  entry: {
    'mcoin': './lib/bcoin-browser',
    'mcoin-worker': './lib/workers/worker'
  },
  output: {
    path: path.join(__dirname, 'browser'),
    filename: '[name].js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['-browser.js', '.js', '.json']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.MCOIN_NETWORK':
        str(env.MCOIN_NETWORK || 'main'),
      'process.env.MCOIN_WORKER_FILE':
        str(env.MCOIN_WORKER_FILE || '/bcoin-worker.js')
    }),
    new UglifyJsPlugin({
      compress: {
        warnings: true
      }
    })
  ]
};
