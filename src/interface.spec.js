import {
  Any,
  Interface
} from './interface';

describe('Interface', () => {
  describe('Creating an interface', () => {
    it('should require a name of type "String"', () => {
      expect(() => new Interface(null))
        .toThrow('Constructor expected argument 1 to be of type "String"');
    });

    it('should require argTypes (if provided) to be of type "Array"', () => {
      expect(() => new Interface('foo', 'bar'))
        .toThrow('Constructor expected argument 2 to be undefined or of type "Array"');
    });

    it('should return a new interface', () => {
      const i = new Interface('foo', [String]);
      const j = new Interface('foo');

      expect(i instanceof Interface).toBe(true);
      expect(j instanceof Interface).toBe(true);
    });
  });

  describe('Using an interface', () => {
    it('should throw an error if an implementation already exists', () => {
      const I = new Interface('Foo');

      class Foo { }

      I.implementedBy(Foo).as(function () {});

      expect(() => {
        I.implementedBy(Foo).as(function () {});
      }).toThrow('Delegate object already implements interface');
    });

    it('should throw if passed an implementation that is not a function', () => {
      const I = new Interface('Foo');

      expect(() => {
        I.implementedBy({}).as(null);
      }).toThrow('Implementation must be a function');
    });

    it('should ensure minimum arity of implementations', () => {
      const I = new Interface('Foo', [String, String]);

      expect(() => {
        I.implementedBy({}).as(function () {});
      }).toThrow('Expected implementation to have minimum arity of 2');

      expect(() => {
        I.implementedBy({}).as(function (a) {
          return a;
        });
      }).toThrow('Expected implementation to have minimum arity of 2');

      expect(() => {
        I.implementedBy({}).as(function (a, b) {
          return a + b;
        });
      }).not.toThrow();

      expect(() => {
        I.implementedBy({}).as(function (a, b, c) {
          return a + b + c;
        });
      }).not.toThrow();
    });

    describe('attaching implementations', () => {
      it('should attach implementations to classes', () => {
        const I = new Interface('Foo');
        const value = 'foo';

        class Foo { }

        I.implementedBy(Foo).as(function () {
          return value;
        });

        const myFoo = new Foo();
        const myOtherFoo = new Foo();

        expect(typeof Foo.prototype[I]).toBe('function');
        expect(typeof myFoo[I]).toBe('function');
        expect(myFoo[I]()).toBe(value);
        expect(myFoo[I]).toEqual(myOtherFoo[I]);
      });

      it('should attach implementations to constructor functions', () => {
        const I = new Interface('Foo');
        const value = 'foo';

        function Foo () { }

        I.implementedBy(Foo).as(function () {
          return value;
        });

        const myFoo = new Foo();
        const myOtherFoo = new Foo();

        expect(typeof Foo.prototype[I]).toBe('function');
        expect(typeof myFoo[I]).toBe('function');
        expect(myFoo[I]()).toBe(value);
        expect(myFoo[I]).toEqual(myOtherFoo[I]);
      });

      it('should attach implementations to instances', () => {
        const I = new Interface('Foo');
        const value = 'foo';

        function Foo () {
          const privateValue = value;

          I.implementedBy(this).as(function () {
            return privateValue;
          });
        }

        const myFoo = new Foo();
        const myOtherFoo = new Foo();

        expect(typeof Foo.prototype[I]).toBe('undefined');
        expect(typeof myFoo[I]).toBe('function');
        expect(myFoo[I]()).toBe(value);
        expect(myFoo[I]).not.toEqual(myOtherFoo[I]);
      });

      it('should attach implementations to objects', () => {
        const I = new Interface('Foo');
        const value = 'foo';

        const foo = {
          bar: value
        };

        I.implementedBy(foo).as(function () {
          return this.bar;
        });

        expect(typeof foo[I]).toBe('function');
        expect(foo[I]()).toBe(value);
      });
    });

    describe('invoking implementations', () => {
      it('should type-check arguments', () => {
        const I = new Interface('Foo', [String, Boolean]);

        class Foo { }

        I.implementedBy(Foo).as(function (a, b) {
          return a && b;
        });

        const myFoo = new Foo();

        expect(() => {
          myFoo[I](null, null);
        }).toThrow('Expected argument 1 to be of type "String"');

        expect(() => {
          myFoo[I]('foo', null);
        }).toThrow('Expected argument 2 to be of type "Boolean"');

        expect(() => {
          myFoo[I]('foo', true);
        }).not.toThrow();

        expect(() => {
          myFoo[I]('foo', true, 'bar');
        }).not.toThrow();
      });

      it('should allow any type when using "Any"', () => {
        const I = new Interface('Foo', [Any, Any]);
        const J = new Interface('Bar', [Any]);

        class Foo { }

        I.implementedBy(Foo).as(function (a, b) {
          return a + b;
        });

        J.implementedBy(Foo).as(function (a) {
          return a;
        });

        const myFoo = new Foo();

        expect(() => {
          myFoo[J]();
        }).toThrow('Must be invoked with at least 1 argument');

        expect(() => {
          myFoo[I](null);
        }).toThrow('Must be invoked with at least 2 arguments');

        expect(() => {
          myFoo[J](null);
        }).not.toThrow();

        expect(() => {
          myFoo[I](null, null);
        }).not.toThrow();
      });
    });
  });

  describe('Setting "writable" when testing', () => {
    let env;

    beforeEach(() => {
      env = process.env;
    });

    it('should make implementations writable when process.env.NODE_ENV is "test"', () => {
      process.env.NODE_ENV = 'test';

      const I = new Interface('Foo');

      class Foo { }

      const ret = 'bar';

      I.implementedBy(Foo).as(function () {
        return ret;
      });

      const myFoo = new Foo();

      // Assert implementation works as expected.
      expect(myFoo[I]()).toEqual(ret);

      // Try to overwrite the implementation.
      expect(() => {
        myFoo[I] = false;
      }).not.toThrow();

      // Assert implementation was overwritten.
      expect(myFoo[I]).toBe(false);
    });

    it('should make implementations non-writable when process.env.NODE_ENV is not "test"', () => {
      process.env.NODE_ENV = 'foo';

      const I = new Interface('Foo');

      class Foo { }

      const ret = 'bar';

      I.implementedBy(Foo).as(function () {
        return ret;
      });

      const myFoo = new Foo();

      // Assert implementation works as expected.
      expect(myFoo[I]()).toEqual(ret);

      // Try to overwrite the implementation.
      expect(() => {
        myFoo[I] = false;
      }).toThrow('Cannot assign to read only property');

      // Assert implementation not was overwritten.
      expect(myFoo[I]()).toEqual(ret);
    });

    it('should make implementations non-writable in the event of an error', () => {
      process.env = {
        get NODE_ENV () {
          throw new Error();
        }
      };

      const I = new Interface('Foo');

      class Foo { }

      const ret = 'bar';

      I.implementedBy(Foo).as(function () {
        return ret;
      });

      const myFoo = new Foo();

      // Assert implementation works as expected.
      expect(myFoo[I]()).toEqual(ret);

      // Try to overwrite the implementation.
      expect(() => {
        myFoo[I] = false;
      }).toThrow('Cannot assign to read only property');

      // Assert implementation not was overwritten.
      expect(myFoo[I]()).toEqual(ret);
    });

    afterEach(() => {
      process.env = env;
    });
  });

  describe('Using Symbols', () => {
    const s = Symbol;

    describe('when Symbol is supported', () => {
      it('should use symbols for descriptors', () => {
        const I = new Interface('Foo');
        expect(typeof I.toString()).toEqual('symbol');
      });
    });

    describe('when Symbol is not supported', () => {
      beforeEach(() => {
        Symbol = undefined; // eslint-disable-line no-global-assign
      });

      it('should use strings for descriptors', () => {
        const I = new Interface('Foo');
        expect(typeof I.toString()).toEqual('string');
      });
    });

    afterEach(() => {
      Symbol = s; // eslint-disable-line no-global-assign
    });
  });
});
