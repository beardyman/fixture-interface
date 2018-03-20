'use strict';

const Promise = require('bluebird');

class Fixture {
  /**
   * @desc Creates a distinct dataset for a test or test suite each callback (insert and remove) must return a promise.
   *
   * @param insert {Function} - A method that is capable of adding a single data object to the data source.  Must return a Promise.
   * @param remove {Function} - A method that is capable of removing a single data object from the data source.  Must return a Promise.
   */
  constructor(insert, remove) {
    this._insert = insert;
    this._delete = remove;
    this.data = [];
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
    return Promise.map(this.data, this._delete).then(()=> this.data = []);
  }
}

module.exports = Fixture;