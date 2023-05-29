# PlumeTesting

## Table of contents

* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Usage](#usage)
* [Contributors](#contributors)
* [Links](#links)

## General info

JejeQL is a tool that can translate a query into a predicate and filter data.

Example:
```
import { tryGetArrayFilteredByQuery } from '@jeje-devs/jeje-ql';

const countries = [
    { name: 'Colombia', capital: 'Bogota', language: 'ES' },
    { name: 'Venezuela', capital: 'Caracas', language: 'ES' },
    { name: 'Ecuador', capital: 'Quito', language: 'ES' },
    { name: 'Guyana', capital: 'Georgetown', language: 'EN' },
    { name: 'Brazil', capital: 'Brasilia', language: 'PT' },
    { name: 'Uruguay', capital: 'Montevideo', language: 'ES' },
    { name: 'Argentina', capital: 'Buenos Aires', language: 'ES' },
    { name: 'Chile', capital: 'Santiago', language: 'ES' }
];

const query = `name = 'Argentina' | language = 'ES' & capital =* 'm' ¦ capital *= 'go'`;
/*
Using typescript, the query would look like:
const predicate = country =>
    country.name === 'Argentina' ||
    country.language === 'ES' &&
    (country.capital.toLower().startsWith('m') || country.capital.toLower().endsWith('go'));
*/

const { success, result } = tryGetArrayFilteredByQuery(countries, query);

/*
What gives the 'result' variable:
[
    { name: 'Uruguay', capital: 'Montevideo', language: 'ES' },
    { name: 'Argentina', capital: 'Buenos Aires', language: 'ES' },
    { name: 'Chile', capital: 'Santiago', language: 'ES' }
]
*/
```

## Technologies

* Node.js
* Typescript

## Setup

```
npm i @jeje-devs/jeje-ql
```

## Usage

### Comparison operators:

**=**: Equals
```
name = 'Harry Potter'
```
**=\***: Starts with
```
name =* 'Har'
```
**\*=**: Ends with
```
name *= 'tter'
```
**\*=\***: Contains
```
name *=* 'Pot'
```
**>**: Higher
```
population > 15000000
```
**<**: Lower
```
population < 70000000
```
**>=**: Higher or equal
```
atomicNumber >= 2
```
**<=**: Lower or equal
```
atomicNumber <= 6
```

### Logical operators:

**|**: OR
```
id = 3 | id = 4
```
* **&**: AND
```
firstName = 'John' & lastName = 'Doe'
```
* **¦**: OR (highest priority)
```
rooms < 3 ¦ rooms > 6
```

### Property names

The properties in the query must have the name of the properties of the JS/TS object:
```
const array = [{ aPropertyWithALongName: 5 }, { aPropertyWithALongName: 3 }];
const query = `aPropertyWithALongName >= 4`;
```

### Comparison values

The comparison values can have 3 types of values:
* string
The value must be written between single quotes:
```
name = 'Mendeleev'
```
* number
The value must be written without quotes:
```
sheepCount > 25
```
* boolean
The value can be either 'true' or 'false', without quotes:
```
hasACat = true
```

### Get predicate:

You can use the method **getPredicatesFromQuery** which gives you an object containing predicates.
The first level contains OR conditions, the second AND conditions and the third OR (highest priority) conditions.
```
import { getPredicatesFromQuery } from '@jeje-devs/jeje-ql';

const predicate = getPredicatesFromQuery(`name =* 'J'`);
```
You can also use the method **tryGetPredicatesFromQuery** which returns a result value showing if the method worked.

### Get filtered array

To get the filtered array, simply use the method **getArrayFilteredByQuery**. It filters the array with the query.
If the query is not valid (syntax error), the array remains unfiltered:
```
import { getArrayFilteredByQuery } from '@jeje-devs/jeje-ql';

const unfiltered = [{ id: 1, name: 'Foo' }, { id: 2, name: 'Bar }];
const filtered = getArrayFilteredByQuery(unfiltered, `name = 'Foo'`);
```
You can also use the method **tryGetArrayFilteredByQuery** which returns a result value showing the method it worked.

## Contributors

- [Jérémie Primas](https://github.com/JeremiePr)

## Links

- [npm](https://www.npmjs.com/package/@jeje-devs/jeje-ql)
- [GitHub](https://github.com/JeremiePr/JejeQL)