'use strict';

const Promise = require('bluebird');

/**
 * Helper for throwing not implemented errors for functions that are expected to be overridden
 * @param name
 */
function notImplemented(name) {
  throw new Error(`${name} must be implmented in your data fixture`);
}

class Fixture {
  /**
   * @desc Creates a distinct dataset for a test or test suite. Expects _insert and _remove to be overridden
   */
  constructor() {
    this.data = [];
  }

  /**
   * @desc Inserts one record into the data source. Intended to be overridden.
   *
   * @private
   */
  _insert() {
    notImplemented('_insert')
  }

  /**
   * @desc Removes one record from the data source. Intended to be overridden.
   *
   * @private
   */
  _remove() {
    notImplemented('_remove')
  }

  /**
   * @desc Takes a given data set and uses the insert function to provision it.
   *
   * @param jsonArray {Array} - an array of data objects to be provisioned
   * @returns {Promise} - A promise that resolves with an array of the resulting insert resolutions.
   */
  provision(jsonArray){
    return Promise.map(jsonArray, (dataObj)=>
      this._insert(dataObj).then(()=>
        this.data.push(dataObj)
      ));
  }

  /**
   * @desc A convenience method for adding data that is generated during the execution of a test. Any data added with this method will be cleaned up when `.cleanup` is called.
   *
   * @param data {Object}
   */
  addData(data) {
    return this.data.push(data);
  }

  /**
   * @desc Clears data by invoking the remove method for each object that was previously provisioned or added.
   *
   * @returns {Promise}
   */
  cleanup() {
    return Promise.map(this.data, (item)=>this._remove(item)).then(()=> this.data = []);
  }
}

module.exports = Fixture;