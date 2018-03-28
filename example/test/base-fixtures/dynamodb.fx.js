'use strict';

const Fx = require('../../../fixture');
const Aws = require('aws-sdk');
const Promise = require('bluebird');

// base class for interfacing with aws's dynamodb
class DynamoFx extends Fx {

  constructor(connConfig, tableName) {
    super();

    this.tableName = tableName;

    // setup dynamo connection info
    const client = new Aws.DynamoDB.DocumentClient(connConfig);
    Promise.promisifyAll(client);
    this.db = client;
  }

  _insert(item) {
    this.db.putAsync({TableName: this.tableName, Item: item});
  }

  _remove(key) {
    this.db.deleteAsync({TableName: this.tableName, Key: key});
  }
}

module.exports = DynamoFx;