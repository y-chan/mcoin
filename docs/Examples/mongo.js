'use strict';

const bcoin = require('../..');
const FullNode = bcoin.fullnode;

const node = new FullNode({
  network: 'main',
  db: 'leveldb',
  dbname: 'bcoin',
  dburi: 'localhost',
  prefix: '.',
  checkpoints: true,
  workers: false,
  logLevel: 'info',
  'max-inbound': 10,
  'max-outbound': 10,
  'index-tx': true,
  'index-address': true,
  'http-port': 8332
});

(async () => {
  await node.open();
  await node.connect();

  node.startSync();
})().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
