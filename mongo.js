'use strict';

const bcoin = require('.');
const FullNode = bcoin.fullnode;

const node = new FullNode({
  network: 'main',
  db: 'leveldb',
  dbname: 'bcoin',
  dbhost: 'localhost',
  prefix: '.',
  checkpoints: true,
  workers: false,
  logLevel: 'info',
  'max-inbound': 8,
  'max-outbound': 8,
  'index-tx': true,
  'index-address': true,
  'http-port': 8332
});

(async () => {
  await node.open();
  await node.connect();

  // await node.chain.reset(100);

  node.startSync();
})().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
