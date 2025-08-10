'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

/**
 * Helper for throwing not implemented errors for functions that are expected to be overridden
 * @param {string} name - Name of the method that must be implemented
 * @throws {Error} Always throws an error indicating the method must be implemented
 */
function notImplemented(name) {
  throw new Error(`${name} must be implemented in your data fixture`);
}

class Fixture {
  /**
   * Creates a distinct dataset for a test or test suite. Expects insert and remove to be overridden
   */
  constructor() {
    this.data = [];
  }

  /**
   * Inserts one record into the data source. Intended to be overridden.
   * @param {any} data - Data object to insert into the data store
   * @returns {Promise<void>} Promise that resolves when insert is complete
   * @throws {Error} Throws error if not implemented by subclass
   */
  insert(data) {
    notImplemented('insert')
  }

  /**
   * Removes one record from the data source. Intended to be overridden.
   * @param {any} data - Identifying data for the record to remove from the data store
   * @returns {Promise<void>} Promise that resolves when removal is complete
   * @throws {Error} Throws error if not implemented by subclass
   */
  remove(data) {
    notImplemented('remove')
  }

  /**
   * Takes a given data set and uses the insert function to provision it.
   *
   * @param {any[]} jsonArray - An array of data objects to be provisioned
   * @returns {Promise<any[]>} A promise that resolves with an array of the provisioned data objects
   */
  provision(jsonArray){
    return Promise.map(_.cloneDeep(jsonArray), (dataObj)=>
      this.insert(dataObj).then(()=>
        this.data.push(dataObj)
      ));
  }

  /**
   * A convenience method for adding data that is generated during the execution of a test. Any data added with this method will be cleaned up when cleanup is called.
   *
   * @param {any} data - Data object to track for cleanup
   * @returns {number} The new length of the data array after adding the item
   */
  addData(data) {
    return this.data.push(data);
  }

  /**
   * Clears data by invoking the remove method for each object that was previously provisioned or added.
   * Also clears the internal data array.
   *
   * @returns {Promise<void>} A promise that resolves when all data has been removed
   */
  cleanup() {
    return Promise.map(this.data, (item)=>this.remove(item)).then(()=> this.data = []);
  }
}

module.exports = Fixture;
