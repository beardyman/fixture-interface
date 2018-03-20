'use strict';

describe('Fixture', ()=>{
  const sinon = require('sinon');
  let Fixture
    , testFixture
    , insertStub
    , removeStub;

  beforeAll(()=>{
    Fixture = require('../fixture');
  });

  beforeEach(() => {
    insertStub = sinon.stub().resolves('hi');
    removeStub = sinon.stub().resolves('bye');
  });

  describe('constructor', () => {
    it('should register the insert and remove methods', () => {
      const constructorFixture = new Fixture(insertStub, removeStub);
      expect(constructorFixture._insert).toBe(insertStub);
      expect(constructorFixture._delete).toBe(removeStub);
      expect(constructorFixture.data).toEqual([]);
    });
  });

  describe('methods', ()=> {
    beforeEach(() => {
      testFixture = new Fixture(insertStub, removeStub);
    });

    it('should invoke invoke insert for each item passed to provision', () => {
      return testFixture.provision([1, 2, 3]).then((res)=>{
        expect(res[0]).toBe(1);
        expect(res[1]).toBe(2);
        expect(res[2]).toBe(3);
        expect(insertStub.callCount).toBe(3);
        expect(testFixture.data.length).toBe(3);
      })
    });

    it('should add an object to the data collection', () => {
      expect(testFixture.addData(1)).toBe(1);
      expect(testFixture.data.length).toBe(1);
    });

    it('should remove all data', () => {
      testFixture.data.push(1,2,3);

      return testFixture.cleanup().then(()=> {
        expect(removeStub.callCount).toBe(3);
        expect(testFixture.data.length).toBe(0);
      });
    });
  });
});