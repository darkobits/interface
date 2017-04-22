# interface

[![travis][travis-img]][travis-url] [![david][david-img]][david-url] [![codacy][codacy-img]][codacy-url] [![Code Style][xo-img]][xo-url] [![NPM Version][npm-img]][npm-url]

> Interfaces for JavaScript. Sort of.

## Setup

```bash
$ npm install @darkobits/interface
```

The `Interface` class allows for the creation of contracts between an object and its consumers. Interfaces are constructed with a name and an optional list of argument types. This package also exports the `Any` value which can be used to indicate a desired arity of an interface's implementation without enforcing argument types.

The value returned from the constructor can then be used in two ways:

1. To implement the interface on classes/objects.
2. As a key that can be used to invoke the interface on objects that implement it.

`Interface` performs a minimum arity check when implementations are registered and performs minimum arity and type-checking against invocations of implementations at runtime.

Implementations are bound to their host objects, so in most cases arrow functions should not be used to define them.

### Using with Classes

In most cases, it will be desirable to attach an interface to a class or
prototype:

```js
import Interface from '@darkobits/interface';

// Create a new interface, Foo, that should be invoked with one string argument.
const Foo = new Interface('Foo', [String]);

class Bar {
  // ...
}

// This implementation doesn't meet the minimum arity for the interface, so it will throw an error:
Foo.implementedBy(Bar).as(function () {

});

// This will pass:
Foo.implementedBy(Bar).as(function (str) {
  // 'this' is bound to the current instance of Bar.
  // Do something with 'str'.
});

// The interface can then be used thusly:
const myBar = new Bar();

myBar[Foo]();      // Arity check will fail, this will throw an error.
myBar[Foo](null);  // Type check will fail, this will throw an error.
myBar[Foo]('baz'); // This will pass.
```

### Using with Instances

In some cases, the interface may need to have access to a constructor function's closure, in which case an interface may be implemented on a per-instance basis:

```js
import Interface from '@darkobits/interface';

const Foo = new Interface('Foo', [String]);

function Bar () {
  // Private data.
  let foo = '';

  this.getFoo = () => {
    return foo;
  };

  Foo.implementedBy(this).as(function (str) {
    // Mutate private data.
    this.foo = str;
  });
}

const myBar = new Bar();
myBar[Foo]('baz');
```

[travis-img]: https://img.shields.io/travis/darkobits/interface/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/darkobits/interface
[david-img]: https://img.shields.io/david/darkobits/interface.svg?style=flat-square
[david-url]: https://david-dm.org/darkobits/interface
[codacy-img]: https://img.shields.io/codacy/coverage/e3fb8e46d6a241f5a952cf3fe6a49d06.svg?style=flat-square
[codacy-url]: https://www.codacy.com/app/darkobits/interface
[xo-img]: https://img.shields.io/badge/code_style-XO-e271a5.svg?style=flat-square
[xo-url]: https://github.com/sindresorhus/xo
[npm-img]: https://img.shields.io/npm/v/@darkobits/interface.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@darkobits/interface
