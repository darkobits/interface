# interface

[![travis][travis-img]][travis-url] [![david][david-img]][david-url] [![codacy][codacy-img]][codacy-url] [![minified][minified-img]][unpkg-url] [![gzipped][gzipped-img]][unpkg-url] [![Code Style][xo-img]][xo-url] [![NPM Version][npm-img]][npm-url]

> Interfaces for JavaScript. Sort of.

## Setup

```bash
$ npm install @darkobits/interface
```

The `Interface` class allows for the creation of contracts between an object and its consumers. Interfaces are constructed with a name and an optional list of argument types. This package also exports the `Any` value which can be used to indicate a desired minimum arity of an interface's implementation without enforcing argument types.

The value returned from the constructor can then be used in two ways:

1. To implement the interface on classes/objects using `implementedBy`.
2. As a key that can be used to invoke the interface on objects that implement it.

`Interface` performs a minimum arity check when implementations are registered and performs minimum arity and type-checking against invocations of implementations at runtime.

**Note:** Implementations are bound to their host objects, so in most cases arrow functions should not be used to define them.

## Using with Classes

When provided a class or constructor function, `Interface` will install implementations on its `prototype`. In most cases, this is desired.

```js
import Interface from '@darkobits/interface';

// Create a new interface, SetName, that should be used with one string argument.
const SetName = new Interface('SetName', [String]);

class Person {
  constructor () {
    this.name = '';
  }

  getName () {
    return this.name;
  }
}

// This implementation doesn't meet the minimum arity for the interface, so it will throw an error:
SetName.implementedBy(Person).as(function () {

});

// This will pass:
SetName.implementedBy(Person).as(function (str) {
  this.name = str;
});

// The interface can then be used thusly:
const frodo = new Person();

frodo[SetName]();                // Arity check will fail, this will throw an error.
frodo[SetName](null);            // Type check will fail, this will throw an error.
frodo[SetName]('Frodo Baggins'); // This will pass.
```

## Using with Instances

In some cases, however, the interface may need to have access to a constructor function's closure. When passed an object, `Interface` will install the implementation onto the object directly.

```js
import Interface from '@darkobits/interface';

const SetName = new Interface('SetName', [String]);

function Person () {
  let name = '';

  this.getName = () => {
    return name;
  };

  SetName.implementedBy(this).as(function (str) {
    name = str;
  });
}

const frodo = new Person();
frodo[SetName]('Frodo Baggins');
```

## Using the `Any` Placeholder

```js
import {
  Any,
  Interface
} from '@darkobits/interface';

// Create an interface to set a key/value pair. Keys should be strings, but values can be anything.
const SetData = new Interface('SetData', [String, Any]);

class Model {
  constructor () {
    this.data = {};
  }

  getData (key) {
    return this.data[key];
  }
}

SetData.implementedBy(Model).as(function (key, value) {
  this.data[key] = value;
});

const myModel = new Model();
myModel[SetData]('someData', [1, 2, 3]);
myModel[SetData]('otherData', 42);
```

## Caveats

Because [*almost* everything in JavaScript is an object](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch3.md#type), it is not possible to have robust type-checking at runtime. For example, strings constructed with the `String()` constructor will pass an `Object` type check, as will functions and arrays.

## &nbsp;
<p align="center">
  <br>
  <img width="22" height="22" src="https://cloud.githubusercontent.com/assets/441546/25318539/db2f4cf2-2845-11e7-8e10-ef97d91cd538.png">
</p>

[travis-img]: https://img.shields.io/travis/darkobits/interface/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/darkobits/interface

[david-img]: https://img.shields.io/david/darkobits/interface.svg?style=flat-square
[david-url]: https://david-dm.org/darkobits/interface

[minified-img]: http://img.badgesize.io/https://unpkg.com/@darkobits/interface/dist/interface.min.js?label=minified&style=flat-square
[gzipped-img]: http://img.badgesize.io/https://unpkg.com/@darkobits/interface/dist/interface.min.js?compression=gzip&label=gzipped&style=flat-square
[unpkg-url]: https://unpkg.com/@darkobits/formation@1.0.0-beta.4/dist/

[codacy-img]: https://img.shields.io/codacy/coverage/9784926ef8bd4cefb583aedcac7e00f2.svg?style=flat-square
[codacy-url]: https://www.codacy.com/app/darkobits/interface

[xo-img]: https://img.shields.io/badge/code_style-XO-f74c4c.svg?style=flat-square
[xo-url]: https://github.com/sindresorhus/xo

[npm-img]: https://img.shields.io/npm/v/@darkobits/interface.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@darkobits/interface
