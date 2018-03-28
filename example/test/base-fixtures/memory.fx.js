'use strict';


const Fx = require('../../../fixture');
const mem = require('../../data-store/memory');
const Promise = require('bluebird');

// base class for interfacing with aws's dynamodb
class MemoryFx extends Fx {

  constructor() {
    super();
  }

  _insert(item) {
    mem[item.hash_key] = item;
    return Promise.resolve();
  }

  _remove(key) {
    delete mem[key.hash_key];
    return Promise.resolve();
  }
}

module.exports = MemoryFx;