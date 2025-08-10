'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const Fixture = require('../fixture');

describe('Fixture', () => {
  let testFixture
    , insertStub
    , removeStub;

  beforeEach(() => {
    insertStub = sinon.stub().resolves('hi');
    removeStub = sinon.stub().resolves('bye');
  });

  describe('constructor', () => {
    let constructorFixture;

    beforeEach(()=>{
      constructorFixture = new Fixture();
    });

    it('should register the insert and remove methods', () => {
      expect(constructorFixture.data).to.deep.equal([]);
    });

    it('shouldn\'t have an initial insert', () => {
      try {
        constructorFixture.insert();
        throw new Error('why here?');
      } catch (e) {
        expect(e.message).to.equal('insert must be implemented in your data fixture')
      }
    });


    it('shouldn\'t have an initial remove', () => {
      try {
        constructorFixture.remove();
        throw new Error('why here?');
      } catch (e) {
        expect(e.message).to.equal('remove must be implemented in your data fixture')
      }
    });
  });

  describe('methods', ()=> {
    beforeEach(() => {
      testFixture = new Fixture();
      testFixture.insert = insertStub;
      testFixture.remove = removeStub;
    });

    it('should invoke invoke insert for each item passed to provision', () => {
      return testFixture.provision([1, 2, 3]).then((res)=>{
        expect(res[0]).to.equal(1);
        expect(res[1]).to.equal(2);
        expect(res[2]).to.equal(3);
        expect(insertStub.callCount).to.equal(3);
        expect(testFixture.data.length).to.equal(3);
      })
    });

    it('should add an object to the data collection', () => {
      expect(testFixture.addData(1)).to.equal(1);
      expect(testFixture.data.length).to.equal(1);
    });

    it('should remove all data', () => {
      testFixture.data.push(1,2,3);

      return testFixture.cleanup().then(()=> {
        expect(removeStub.callCount).to.equal(3);
        expect(testFixture.data.length).to.equal(0);
      });
    });
  });
});
