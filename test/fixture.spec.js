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
    let constructorFixture;

    beforeEach(()=>{
      constructorFixture = new Fixture();
    });

    it('should register the insert and remove methods', () => {
      expect(constructorFixture.data).toEqual([]);
    });

    it('shouldn\'t have an initial _insert', () => {
      try {
        constructorFixture._insert();
        throw new Error('why here?');
      } catch (e) {
        expect(e.message).toBe('_insert must be implmented in your data fixture')
      }
    });


    it('shouldn\'t have an initial _remove', () => {
      try {
        constructorFixture._remove();
        throw new Error('why here?');
      } catch (e) {
        expect(e.message).toBe('_remove must be implmented in your data fixture')
      }
    });
  });

  describe('methods', ()=> {
    beforeEach(() => {
      testFixture = new Fixture();
      testFixture._insert = insertStub;
      testFixture._remove = removeStub;
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