'use strict';

const MemoryFx = require('../base-fixtures/memory.fx');

class carFx extends MemoryFx {
  constructor() {
    super(/*config.carTableName*/);
  }

  insert(item) {
    // create identifier key
    item.hash_key = `${item.year};${item.make};${item.model}`;
    return super.insert(item);
  }

  remove(item) {
    return super.remove({hash_key: item.hash_key});
  }
}


module.exports = carFx;