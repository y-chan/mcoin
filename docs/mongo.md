This release removes the leveldb key:val blockchain api and replaces it with a 1:1 MongoDB document api drop-in. Running a full node will store blockchain data in a MongoDB instance determined by Bcoin's configuration options. Bcoin works as normal but it's database layer is now powered by MongoDB.

**Requirements**
 * MongoDB 3.4
 * Node 7.6+

**Changelog:**
 * Modern Javascript, Node 8 & Async/Await
 * Mongoose ODM
 * Removed 'db' configuration option.
 * Added 'dbname' &  'dbhost' configuration options.
 	* Specify a mongodb instance and location. Default 'bcoin', 'localhost'.
 * Transactions and Addresses index by default
 * Schema Support for Bcoin primitives:
   * Address
   * Block
   * Coin
   * Entry
   * Input
   * Meta
   * Output
   * StateCache
   * Tip
   * Transaction
   * UndoCoin

 **Example (found in docs/Examples/mongo.js)**
 ```
const bcoin = require('.'); // Check cwd
const FullNode = bcoin.fullnode;

const node = new FullNode({
  network: 'main',
  dbname: 'bcoin',
  dbhost: 'localhost',
  checkpoints: true,
  workers: true,
  logLevel: 'info',
  'max-inbound': 8,
  'max-outbound': 8,
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

 ```

