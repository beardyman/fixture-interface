'use strict';

const MemoryFx = require('../base-fixtures/memory.fx');

class carFx extends MemoryFx {
  constructor() {
    super(/*config.carTableName*/);
  }

  _insert(item) {
    // create identifier key
    item.hash_key = `${item.year};${item.make};${item.model}`;
    return super._insert(item);
  }

  _remove(item) {
    return super._remove({hash_key: item.hash_key});
  }
}


module.exports = carFx;