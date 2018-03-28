'use strict';

const CarFx = require('./fixtures/car.fx');
const _ = require('lodash');

describe('combined test', ()=> {
  let carFx;


  describe('test', function () {

    beforeAll(() => {
      carFx = new CarFx();
      // creates 100 records via fixture
      return carFx.provision(_.times(100, (n) => ({
        year: n,
        make: 'rick',
        model: 'trash from the garage',
        description: 'this is a test'
      })))
        .then(() =>
          // provisions data from a json file
          carFx.provision(require('./fixture-data/cars.json'))
        )
    });

    afterAll(() => {
      return carFx.cleanup();
    });

    it('should be holding all the data from both provisions', () => {
      expect(carFx.data.length).toBe(102);
    });

    it('should actually have the data in the data store', () => {
      const store = require('../data-store/memory');
      expect(_.values(store).length).toBe(102);
      // some spot checking
      expect(store['0;rick;trash from the garage'].year).toBe(0);
      expect(store['2000;Pontiac;Grand Prix'].reviews[0].author).toBe('Rick Sanchez');
      expect(store['2010;Jeep;Grand Cherokee'].reviews[0].author).toBe('Morty Smith');
    });
  });

  describe('cleanup test', () => {
    it('should have removed data from the data source', () => {
      expect(carFx.data.length).toBe(0);

      const store = require('../data-store/memory');
      expect(_.values(store).length).toBe(0);
    });
  });


});
