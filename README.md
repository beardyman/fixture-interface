# fixture-interface

A JavaScript test fixture library that provides a simple interface for managing test data lifecycle across different storage backends.

## Summary

This library solves the common testing problem of setting up and cleaning up test data. It provides a consistent interface for provisioning test data before tests run and automatically cleaning it up afterward, preventing test pollution and ensuring reliable test execution across different data stores.

## How it works

**Core Purpose:**
- **Setup**: Bulk insert test data before tests run using the `provision()` method
- **Cleanup**: Automatically remove all test data after tests complete using the `cleanup()` method  
- **Track**: Keep track of data created during test execution using the `addData()` method

**Key Benefits:**
- Prevents test pollution by ensuring clean data state between tests
- Supports different data stores (memory, DynamoDB, etc.) through inheritance
- Uses deep cloning to prevent accidental data modification
- Promise-based for async operations

## Installation

```bash
npm install fixture-interface
```

## Module Support

This package supports both CommonJS and ESM (ES Modules). Node.js will automatically use the appropriate version based on your project setup.

## TypeScript Support

This package includes TypeScript declaration files (`.d.ts`) for full type safety and IntelliSense support in TypeScript projects.

## Example Usage

### 1. Create a base fixture for your data store

**CommonJS:**
```javascript
// base-fixtures/memory.fx.js
const Fixture = require('fixture-interface');
const memoryStore = require('../data-store/memory');

class MemoryFixture extends Fixture {
  insert(item) {
    memoryStore[item.id] = item;
    return Promise.resolve();
  }

  remove(item) {
    delete memoryStore[item.id];
    return Promise.resolve();
  }
}

module.exports = MemoryFixture;
```

**ESM:**
```javascript
// base-fixtures/memory.fx.js
import Fixture from 'fixture-interface';
import memoryStore from '../data-store/memory.js';

class MemoryFixture extends Fixture {
  insert(item) {
    memoryStore[item.id] = item;
    return Promise.resolve();
  }

  remove(item) {
    delete memoryStore[item.id];
    return Promise.resolve();
  }
}

export default MemoryFixture;
```

### 2. Create domain-specific fixtures

**CommonJS:**
```javascript
// fixtures/car.fx.js
const MemoryFixture = require('../base-fixtures/memory.fx');

class CarFixture extends MemoryFixture {
  insert(item) {
    // Add domain-specific logic
    item.hash_key = `${item.year};${item.make};${item.model}`;
    return super.insert(item);
  }

  remove(item) {
    return super.remove({id: item.hash_key});
  }
}

module.exports = CarFixture;
```

**ESM:**
```javascript
// fixtures/car.fx.js
import MemoryFixture from '../base-fixtures/memory.fx.js';

class CarFixture extends MemoryFixture {
  insert(item) {
    // Add domain-specific logic
    item.hash_key = `${item.year};${item.make};${item.model}`;
    return super.insert(item);
  }

  remove(item) {
    return super.remove({id: item.hash_key});
  }
}

export default CarFixture;
```

### 3. Use in your tests

**CommonJS:**
```javascript
// test.spec.js
const CarFixture = require('./fixtures/car.fx');
const testData = require('./fixture-data/cars.json');

describe('Car tests', () => {
  let carFixture;

  beforeEach(async () => {
    carFixture = new CarFixture();
    await carFixture.provision(testData); // Sets up all test data
  });

  afterEach(async () => {
    await carFixture.cleanup(); // Removes all test data
  });

  it('should find cars by make', () => {
    // Your test logic here - data is already provisioned
  });
});
```

**ESM:**
```javascript
// test.spec.js
import CarFixture from './fixtures/car.fx.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testData = JSON.parse(readFileSync(join(__dirname, './fixture-data/cars.json'), 'utf8'));

describe('Car tests', () => {
  let carFixture;

  beforeEach(async () => {
    carFixture = new CarFixture();
    await carFixture.provision(testData); // Sets up all test data
  });

  afterEach(async () => {
    await carFixture.cleanup(); // Removes all test data
  });

  it('should find cars by make', () => {
    // Your test logic here - data is already provisioned
  });
});
```

### 4. Test data format

```json
// fixture-data/cars.json
[
  {
    "year": 2000,
    "make": "Pontiac", 
    "model": "Grand Prix",
    "reviews": [
      {
        "author": "Rick Sanchez",
        "rating": 5,
        "review": "Great car!"
      }
    ]
  }
]
```

The fixture will provision this data before each test and clean it up afterward, ensuring each test starts with a known data state.

