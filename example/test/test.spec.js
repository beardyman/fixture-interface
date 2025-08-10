'use strict';

const { expect } = require('chai');
const CarFx = require('./fixtures/car.fx');
const _ = require('lodash');

describe('Full test', () => {
  let carFx;

  describe('test', () => {

    before(() => {
      carFx = new CarFx();
      // creates 100 records via fixture
      return carFx.provision(_.times(100, (n) => ({
        year: n,
        make: 'Simple Rick\'s',
        model: 'trash from the garage',
        description: 'this is a test'
      })))
        .then(() =>
          // provisions data from a json file
          carFx.provision(require('./fixture-data/cars.json'))
        )
    });

    after(() => {
      return carFx.cleanup();
    });

    it('should be holding all the data from both provisions', () => {
      expect(carFx.data.length).to.equal(102);
    });

    it('should actually have the data in the data store', () => {
      const store = require('../data-store/memory');
      expect(_.values(store).length).to.equal(102);
      // some spot checking
      expect(store['0;Simple Rick\'s;trash from the garage'].year).to.equal(0);
      expect(store['2000;Pontiac;Grand Prix'].reviews[0].author).to.equal('Rick Sanchez');
      expect(store['2010;Jeep;Grand Cherokee'].reviews[0].author).to.equal('Morty Smith');
    });
  });

  describe('cleanup test', () => {
    it('should have removed data from the data source', () => {
      expect(carFx.data.length).to.equal(0);

      const store = require('../data-store/memory');
      expect(_.values(store).length).to.equal(0);
    });
  });


});
