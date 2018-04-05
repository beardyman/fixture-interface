'use strict';

const Fx = require('../../../fixture');
const Aws = require('aws-sdk');
const Promise = require('bluebird');

/*
 * base class for interfacing with aws's dynamodb
 * This is meant to be a more practical example
 */
class DynamoFx extends Fx {

  constructor(connConfig, tableName) {
    super();

    this.tableName = tableName;

    // setup dynamo connection info
    const client = new Aws.DynamoDB.DocumentClient(connConfig);
    Promise.promisifyAll(client);
    this.db = client;
  }

  insert(item) {
    this.db.putAsync({TableName: this.tableName, Item: item});
  }

  remove(key) {
    this.db.deleteAsync({TableName: this.tableName, Key: key});
  }
}

module.exports = DynamoFx;