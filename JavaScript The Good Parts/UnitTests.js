var assert = require('assert');

describe('Chapter 1: Good Parts', function () {
    Function.prototype.method = function (name, func) {
        this.prototype[name] = func;
        return this;
    };
})

describe('Chapter 2: Grammar', function() {
    it('Strings', function() {
        assert.equal('c' + 'a' + 't', 'cat');
        assert.equal('cat'.toUpperCase(), 'CAT');
    })

    it('Expressions', function () {
        assert.equal(2 + 3 * 5, 17);
        assert.equal((2 + 3) * 5, 25);
    })
})

describe('Chapter 3: Objects', function () {
    var empty_object = {};

    var stooge = {
        "first-name": "Jerome",
        "last-name": "Howard"
    };

    var flight = {
        airline: "Oceanic",
        number: 815,
        departure: {
            IATA: "SYD",
            time: "2004-09-22 14:55",
            city: "Sydney"
        },
        arrival: {
            IATA: "LAX",
            time: "2004-09-23 10:42",
            city: "Los Angeles"
        }
    };

    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            var F = function () { };
            F.prototype = o;
            return new F();
        };
    }
    var another_stooge = Object.create(stooge);

    another_stooge['first-name'] = 'Harry';
    another_stooge['middle-name'] = 'Moses';
    another_stooge.nickname = 'Moe';

    stooge.profession = 'actor';

    var x = stooge;
    x.nickname = 'Curly';

    it('Retrieval', function () {
        var middle = stooge["middle-name"] || "(none)";
        var status = flight.status || "unknown";

        assert.equal(stooge["first-name"], "Jerome");
        assert.equal(flight.departure.IATA, "SYD");

        assert.equal(middle, "(none)");
        assert.equal(status, "unknown");

        assert.equal(flight.equipment, undefined);
        assert.throws(function () {
            return flight.equipment.model;
        }, TypeError);
        assert.equal(flight.equipment && flight.equipment.model, undefined);
    });

    it('Update', function () {
        assert.equal(stooge['first-name'], 'Jerome');
        stooge['middle-name'] = 'Lester';
        stooge.nickname = 'Curly';
        flight.equipment = {
            model: 'Boeing 777'
        };
        flight.status = 'overdue';

        assert.equal(flight.status, 'overdue');
    });

    it('Reference', function () {
        var nick = stooge.nickname;

        var a = {}, b = {}, c = {};
        a = b = c = {};

        assert.equal(stooge.nickname, x.nickname);
        assert.equal(x.nickname, 'Curly');

        assert.equal(a, b);
        assert.equal(b, c);
    });

    it('Prototype', function () {
        assert.equal(another_stooge.profession, 'actor');
    });

    it('Reflection', function () {
        flight.status = 'overdue';
        assert.equal(typeof flight.number, 'number');
        assert.equal(typeof flight.status, 'string');
        assert.equal(typeof flight.arrival, 'object');
        assert.equal(typeof flight.manifest, 'undefined');

        assert.equal(typeof flight.toString, 'function');
        assert.equal(typeof flight.constructor, 'function');

        assert.ok(flight.hasOwnProperty('number'));
        assert.equal(flight.hasOwnProperty('constructor'), false);
    });

    it('Enumeration', function () {
        var properties = ['first-name', 'middle-name', 'nickname', 'last-name', 'profession'];
        var i = 0;
        var name;
        for (name in another_stooge) {
            if (typeof another_stooge[name] !== 'function') {
                assert.equal(name, properties[i]);
            }
            i += 1;
        }

        var i;
        var properties = [
            'first-name',
            'middle-name',
            'last-name',
            'profession'
        ];
        var expected = [
            'Harry',
            'Moses',
            'Howard',
            'actor'
        ];
        for (i = 0; i < properties.length; i += 1) {
            assert.equal(expected[i], another_stooge[properties[i]])
        }
    });

    it('Delete', function () {
        assert.equal(another_stooge.nickname, 'Moe');
        delete another_stooge.nickname;
        assert.equal(another_stooge.nickname, 'Curly');
    });

    it('Global Abatement', function () {
        var MYAPP = {};

        MYAPP.stooge = {
            "first-name": "Joe",
            "last-name": "Howard"
        };

        MYAPP.flight = {
            airline: "Oceanic",
            number: 815,
            departure: {
                IATA: "SYD",
                time: "2004-09-22 14:55",
                city: "Sydney"
            },
            arrival: {
                IATA: "LAX",
                time: "2004-09-23 10:42",
                city: "Los Angeles"
            }
        };
    });
});

describe('Chapter 4: Functions', function () {
    var add = function (a, b) {
        return a + b;
    };

    var myObject = {
        value: 0,
        increment: function (inc) {
            this.value += typeof inc === 'number' ? inc : 1;
        }
    };

    var Quo = function (string) {
        this.status = string;
    };

    Quo.prototype.get_status = function () {
        return this.status;
    };

    it('Function Literal', function () { });

    it('The Method Invocation Pattern', function () {
        myObject.increment();
        assert.equal(myObject.value, 1);
        myObject.increment(2);
        assert.equal(myObject.value, 3);
    });

    it('The Function Invocation Pattern', function () {
        var sum = add(3, 4);
        assert.equal(sum, 7);

        myObject.double = function () {
            var that = this;
            var helper = function () {
                that.value = add(that.value, that.value);
            };

            helper();
        };

        myObject.increment();
        myObject.increment();

        myObject.double();
        assert.equal(myObject.value, 4);
    });

    it('The Constructor Invocation Pattern', function () {
        var myQuo = new Quo("confused");
        assert.equal(myQuo.get_status(), "confused");
    });

    it('The Apply Invocation Pattern', function () {
        var array = [3, 4];
        var sum = add.apply(null, array);
        assert.equal(sum, 7);

        var statusObject = {
            status: 'A-OK'
        };

        var status = Quo.prototype.get_status.apply(statusObject);
        assert.equal(status, 'A-OK');
    });

    it('Arguments', function () {
        var sum = function () {
            var i, sum = 0;
            for (i = 0; i < arguments.length; i += 1) {
                sum += arguments[i];
            }
            return sum;
        }
        assert.equal(sum(4, 8, 15, 16, 23, 42), 108);
    });

    it('Exceptions', function () {
        var add = function (a, b) {
            if (typeof a !== 'number' || typeof b !== 'number') {
                throw {
                    name: 'TypeError',
                    message: 'add needs numbers'
                };
            }
            return a + b;
        }
        var try_it = function () {
            try {
                add("seven");
            } catch (e) {
                assert.equal(e.name, 'TypeError');
                assert.equal(e.message, 'add needs numbers');
            }
        }
        try_it();
    });

    it('Augmenting Types', function () {
        Function.prototype.method = function (name, func) {
            this.prototype[name] = func;
            return this;
        };

        Number.method('integer', function () {
            return Math[this < 0 ? 'ceil' : 'floor'](this);
        });

        assert.equal((-10 / 3).integer(), -3);

        String.method('trim', function () {
            return this.replace(/^\s+|\s+$/g, '');
        });

        assert.equal('"' + "   neat   ".trim() + '"', '"neat"');

        Function.prototype.method = function (name, func) {
            if (!this.prototype[name]) {
                this.prototype[name] = func;
            }
        };
    });

    it('Recursion', function () {
        var hanoi = function hanoi(disc, src, aux, dst) {
            if (disc > 0) {
                hanoi(disc - 1, src, dst, aux);
                hanoi(disc - 1, aux, src, dst);
            }
        };

        var factorial = function factorial(i, a) {
            a = a || 1;
            if (i < 2) {
                return a;
            }
            return factorial(i - 1, a * i);
        };

        assert.equal(factorial(4), 24);
    });

    it('Scope', function () {
        var foo = function () {
            var a = 3, b = 5;

            assert.equal(a, 3);
            assert.equal(b, 5);
            var bar = function () {
                var b = 7, c = 11;
                assert.equal(b, 7);
                assert.equal(c, 11);
                a += b + c;
                assert.equal(a, 21);
            };
            assert.equal(a, 3);
            assert.equal(b, 5);
            assert.throws(function () { c === 11; }, ReferenceError);
            bar();
            assert.equal(a, 21);
            assert.equal(b, 5);
        };
        foo();

        var myObject = (function () {
            var value = 0;

            return {
                increment: function (inc) {
                    value += typeof inc === 'number' ? inc : 1;
                },
                getValue: function () {
                    return value;
                }
            };
        } ());

        var quo = function (status) {
            return {
                get_status: function () {
                    return status;
                }
            };
        };

        var myQuo = quo("amazed");
        assert.equal(myQuo.get_status(), "amazed");
    });

    it('Module', function () {
        String.method('deentityify', function () {
            var entity = {
                quot: '"',
                lt: '<',
                gt: '>'
            };

            return function () {
                return this.replace(/&([^&;]+);/g,
                    function (a, b) {
                        var r = entity[b];
                        return typeof r === 'string' ? r : a;
                    });
            };
        } ());

        var serial_maker = function () {
            var prefix = '';
            var seq = 0;
            return {
                set_prefix: function (p) {
                    prefix = String(p);
                },
                set_seq: function (s) {
                    seq = s;
                },
                gensym: function () {
                    var result = prefix + seq;
                    seq += 1;
                    return result;
                }
            };
        };

        var seqer = serial_maker();
        seqer.set_prefix('Q');
        seqer.set_seq(1000);
        var unique = seqer.gensym();

        assert.equal(unique, "Q1000");
    });

    it('Curry', function () {
        Function.method('curry', function () {
            var slice = Array.prototype.slice,
                args = slice.apply(arguments),
                that = this;
            return function () {
                return that.apply(null, args.concat(slice.apply(arguments)));
            };
        });

        var add = function (a, b) {
            return a + b;
        };

        var add1 = add.curry(1);
        assert.equal(add1(6), 7);
    });

    it('Memoization', function () {
        var slowFib = function (n) {
            return n < 2 ? n : slowFib(n - 1) + slowFib(n - 2);
        };

        var memoFib = (function (n) {
            var memo = [0, 1];
            var fib = function (n) {
                var result = memo[n];
                if (typeof result !== 'number') {
                    result = fib(n - 1) + fib(n - 2);
                    memo[n] = result;
                }
                return result;
            };
            return fib;
        } ());

        var memoizer = function (memo, formula) {
            var recur = function (n) {
                var result = memo[n];
                if (typeof result !== 'number') {
                    result = formula(recur, n);
                    memo[n] = result;
                }
                return result;
            };
            return recur;
        };

        var fibonacci = memoizer([0, 1], function (recur, n) {
            return recur(n - 1) + recur(n - 2);
        });

        var expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
        for (var i = 0; i <= 10; i += 1) {
            assert.equal(slowFib(i), expected[i]);
            assert.equal(memoFib(i), expected[i]);
            assert.equal(fibonacci(i), expected[i]);
        }

        var factorial = memoizer([0, 1], function (recur, n) {
            return n * recur(n - 1);
        });
    });
});

describe('Chapter 5: Inheritance', function () {
    it('Pseudoclassical', function () {
        this.prototype = { constructor: this };
        Function.method('new', function () {
            var that = Object.create(this.prototype);
            var other = this.apply(that, arguments);
            return (typeof other === 'object' && other) || that;
        });

        var Mammal = function (name) {
            this.name = name;
        };
        Mammal.prototype.get_name = function () {
            return this.name;
        };
        Mammal.prototype.says = function () {
            return this.saying || '';
        };
        var myMammal = new Mammal('Herb the mammal');
        var name = myMammal.get_name();
        assert.equal(name, "Herb the mammal");

        var Cat = function (name) {
            this.name = name;
            this.saying = 'meow';
        };
        Cat.prototype = new Mammal();
        Cat.prototype.purr = function (n) {
            var i, s = '';
            for (i = 0; i < n; i += 1) {
                if (s) {
                    s += '-';
                }
                s += 'r';
            }
            return s;
        };
        Cat.prototype.get_name = function () {
            return this.says() + ' ' + this.name + ' ' + this.says();
        };
        var myCat = new Cat('Henrietta');
        var says = myCat.says();
        var purr = myCat.purr(5);
        var name = myCat.get_name();
        assert.equal(says, "meow");
        assert.equal(purr, "r-r-r-r-r");
        assert.equal(name, "meow Henrietta meow");

        Function.method('inherits', function (Parent) {
            this.prototype = new Parent();
            return this;
        });

        var Cat = function (name) {
            this.name = name;
            this.saying = 'meow';
        }.inherits(Mammal).
            method('purr', function (n) {
                var i, s = '';
                for (i = 0; i < n; i += 1) {
                    if (s) {
                        s += '-';
                    }
                    s += 'r';
                }
                return s;
            }).method('get_name', function () {
                return this.says() + ' ' + this.name + ' ' + this.says();
            });
    });

    it('Object Specifiers', function () {
        /* var myObject = maker(f, l, m, c, s);

        var myObject = maker({
            first: f,
            last: l,
            middle: m,
            state: s,
            city: c
        }); */
    });

    it('Prototypal', function () {
        var myMammal = {
            name: 'Herb the Mammal',
            get_name: function () {
                return this.name;
            },
            says: function () {
                return this.saying || '';
            }
        };

        var myCat = Object.create(myMammal);
        myCat.name = 'Henrietta';
        myCat.saying = 'meow';
        myCat.purr = function (n) {
            var i, s = '';
            for (i = 0; i < n; i += 1) {
                if (s) {
                    s += '-';
                }
                s += 'r';
            }
            return s;
        };
        myCat.get_name = function () {
            return this.says() + ' ' + this.name + ' ' + this.says();
        };

        var block = function () {
            var oldScope = scope;
            scope = Object.create(scope);
            advance('{');
            parse(scope);
            advance('}');
            scope = oldScope;
        };
    });

    it('Functional', function () {
        var mammal = function (spec) {
            var that = {};
            that.get_name = function () {
                return spec.name;
            };
            that.says = function () {
                return spec.saying || '';
            };
            return that;
        };
        var myMammal = mammal({ name: 'Herb' });
        var cat = function (spec) {
            spec.saying = spec.saying || 'meow';
            var that = mammal(spec);
            that.purr = function (n) {
                var i, s = '';
                for (i = 0; i < n; i += 1) {
                    if (s) {
                        s += '-';
                    }
                    s += 'r';
                }
                return s;
            }
            that.get_name = function () {
                return that.says() + ' ' + spec.name + ' ' + that.says();
            };
            return that;
        };
        var myCat = cat({ name: 'Henrietta' });

        Object.method('superior', function (name) {
            var that = this,
                method = that[name];
            return function () {
                return method.apply(that, arguments);
            };
        });

        var coolcat = function (spec) {
            var that = cat(spec),
                super_get_name = that.superior('get_name');
            that.get_name = function (n) {
                return 'like ' + super_get_name() + ' baby';
            };
            return that;
        };

        var myCoolCat = coolcat({ name: 'Bix' });
        var name = myCoolCat.get_name();

        assert.equal(name, 'like meow Bix meow baby');
    });

    it('Parts', function () {
        var eventuality = function (that) {
            var registry = {};

            that.fire = function (event) {

                var array,
                    func,
                    handler,
                    i,
                    type = typeof event === 'string' ? event : event.type;

                if (registry.hasOwnProperty(type)) {
                    array = registry[type];
                    for (i = 0; i < array.length; i += 1) {
                        handler = array[i];

                        func = handler.method;
                        if (typeof func === 'string') {
                            func = this[func];
                        }

                        func.apply(this, handler.parameters || event);
                    }
                }

                return this;
            };

            that.on = function (type, method, parameters) {
                var handler = {
                    method: method,
                    parameters: parameters
                };
                if (registry.hasOwnProperty(type)) {
                    registry[type].push(handler);
                } else {
                    registry[type] = [handler];
                }
                return this;
            };
            return that;
        };
    });
});

describe('Chapter 6: Arrays', function () {
    var numbers = [
        'zero', 'one', 'two', 'three', 'four',
        'five', 'six', 'seven', 'eight', 'nine'
    ];

    numbers.length = 3;

    it('Array Literals', function () {
        var empty = [];

        assert.equal(empty[1], undefined);
        assert.equal(numbers[1], 'one');
        assert.equal(empty.length, 0);
        assert.equal(numbers.length, 3);

        var numbers_object = {
            '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
            '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine'
        };

        var misc = ['string', 98.6, true, false, null, undefined, ['nested', 'array'], { object: true }, NaN, Infinity];
        assert.equal(misc.length, 10);
    });

    it('Length', function () {
        var myArray = [];
        assert.equal(myArray.length, 0);

        myArray[1000000] = true;
        assert.equal(myArray.length, 1000001);

        assert.deepEqual(numbers, ['zero', 'one', 'two']);

        numbers[numbers.length] = 'shi';
        assert.deepEqual(numbers, ['zero', 'one', 'two', 'shi']);

        numbers.push('go');
        assert.deepEqual(numbers, ['zero', 'one', 'two', 'shi', 'go']);
    });

    it('Delete', function () {
        delete numbers[2];
        assert.deepEqual(numbers, ['zero', 'one']);
    });

    it('Enumeration', function () {
        myArray = [0, 1, 2, 3, 4, 5, 6];
        var i;
        for (i = 0; i < myArray.length; i += 1) {
            assert.equal(myArray[i], i);
        }
    });

    it('Confusion', function () {
        var is_array = function (value) {
            return value && typeof value === 'object' && value.constructor === Array;
        };

        var is_array = function (value) {
            return Object.prototype.toString.apply(value) === '[object Array]';
        };
    });

    it('Methods', function () {
        Array.method('reduce', function (f, value) {
            var i;
            for (i = 0; i < this.length; i += 1) {
                value = f(this[i], value);
            }
            return value;
        });

        var data = [4, 8, 15, 16, 23, 42];
        var add = function (a, b) {
            return a + b;
        };
        var mult = function (a, b) {
            return a * b;
        };
        var sum = data.reduce(add, 0);
        assert.equal(sum, 108);

        var product = data.reduce(mult, 1);
        assert.equal(product, 7418880);
        data.total = function () {
            return this.reduce(add, 0);
        };

        total = data.total();
        assert.equal(total, 108);
    });

    it('Dimensions', function () {
        Array.dim = function (dimension, initial) {
            var a = [], i;
            for (i = 0; i < dimension; i += 1) {
                a[i] = initial;
            }
            return a;
        };
        var myArray = Array.dim(10, 0);

        var matrix = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ];
        assert.equal(matrix[2][1], 7);
        var n = myArray.length
        for (i = 0; i < n; i += 1) {
            myArray[i] = [];
        }

        Array.matrix = function (m, n, initial) {
            var a, i, j, mat = [];
            for (i = 0; i < m; i += 1) {
                a = [];
                for (j = 0; j < n; j += 1) {
                    a[j] = initial;
                }
                mat[i] = a;
            }
            return mat;
        };

        var myMatrix = Array.matrix(4, 4, 0);

        assert.equal(myMatrix[3][3], 0);

        Array.identity = function (n) {
            var i, mat = Array.matrix(n, n, 0);
            for (i = 0; i < n; i += 1) {
                mat[i][i] = 1;
            }
            return mat;
        };

        myMatrix = Array.identity(4);
        assert.equal(myMatrix[3][3], 1);
    });
})

describe('Chapter 7: Regular Expressions', function () { });