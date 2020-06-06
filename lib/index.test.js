const mapData = require("./index");

describe("Object expressions", () => {
    test("Invalid data", () => {
        let expression = { name: "name" };

        let result = mapData(expression, null);

        expect(result).toBe(null);
    });

    test("Invalid expression", () => {
        let data = {
            name: "John",
            age: 20
        };

        let result = mapData(null, data);

        expect(result).toEqual({
            name: "John",
            age: 20
        });
    });

    test("Single property", () => {
        let data = {
            name: "John",
            age: 20
        };

        let expression = { fullName: "name" };

        let result = mapData(expression, data);

        expect(result).toEqual({ fullName: "John" });
    });

    test("Multiple level", () => {
        let data = {
            id: 1,
            name: "John"
        };

        let expression = {
            id: "id",
            buyer: {
                name: "name"
            }
        }

        let result = mapData(expression, data);

        expect(result).toEqual({
            id: 1,
            buyer: {
                name: "John"
            }
        });
    });
});

describe("Non object expressions", () => {
    test("String expression", () => {
        let data = {
            name: "John"
        };

        let result = mapData("name", data);

        expect(result).toBe("John");
    });

    test("Non string expression", () => {
        let data = {
            name: "John",
            age: 20
        };

        let result = mapData(123, data);

        expect(result).toEqual(null);
    });
});

describe("Configuration", () => {
    test("Change mapFn", () => {
        let data = {
            name: "John",
            age: 20
        };

        let expression = {
            name: "name"
        };

        let result = mapData(expression, data, { mapFn: () => 1 });

        expect(result).toEqual({
            name: 1
        });
    });
});

describe("Selector", () => {
    test("Selector change the object data scope", () => {
        let data = {
            name: {
                first: "John",
                last: "Doe"
            }
        };

        let expression = {
            _selector: "name",
            first: "first"
        };

        let result = mapData(expression, data);

        expect(result).toEqual({
            first: "John"
        });
    });

    test("Selector can be a function", () => {
        let data = {
            name: {
                first: "John",
                last: "Doe"
            }
        };

        let expression = {
            _selector: data => data.name,
            first: "first"
        };

        let result = mapData(expression, data);

        expect(result).toEqual({
            first: "John"
        });
    });

    test("Seletor other than string or function", () => {
        let data = {
            name: {
                first: "John",
                last: "Doe"
            }
        };

        let expression = {
            _selector: 123,
            first: "first"
        };

        expect(() => mapData(expression, data))
            .toThrowError("InvalidSelector");
    });
});

describe("Transformations", () => {
    test("Transform expression", () => {
        let data = {
            date: "2020-01-01T08:00:00"
        };

        let expression = {
            date: {
                _selector: "date",
                _transform: data => new Date(data)
            }
        };

        let result = mapData(expression, data);

        expect(result).toEqual({
            date: new Date(2020, 0, 1, 8)
        });
    });

    test("Transform expression other than function", () => {
        let data = {
            date: "2020-01-01T08:00:00"
        };

        let expression = {
            date: {
                _selector: "date",
                _transform: "blah"
            }
        };

        expect(() => mapData(expression, data))
            .toThrowError("InvalidTransform");
    });

    test("Transform without selector should use the root data", () => {
        let data = {
            date: "2020-01-01T08:00:00"
        };

        let expression = {
            _transform: data => new Date(data.date)
        };

        let result = mapData(expression, data);

        expect(result).toEqual(new Date(2020, 0, 1, 8));
    });
});

describe("Data arrays", () => {
    test("When data is an array, it should return a transformed array", () => {
        let data = [
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" }
        ];

        let expression = {
            name: "name"
        };

        let result = mapData(expression, data);

        expect(result).toEqual([
            { name: "Item 1" },
            { name: "Item 2" }
        ]);
    });

    test("When a selector evaluate to an array, it should return a transformed array", () => {
        let data = {
            items: [
                { id: 1, name: "Item 1" },
                { id: 2, name: "Item 2" }
            ]
        };

        let expression = {
            _selector: "items",
            name: "name"
        };

        let result = mapData(expression, data);

        expect(result).toEqual([
            { name: "Item 1" },
            { name: "Item 2" }
        ]);
    });
});

describe("Utilities", () => {
    describe("asInt", () => {
        test("Value can be converted, then return Number", () => {
            let data = {
                amount: "123"
            };

            let expression = {
                amount: mapData.asInt("amount")
            };

            let result = mapData(expression, data);

            expect(result).toEqual({
                amount: 123
            });
        });

        test("Value can not be converted, then return NaN", () => {
            let data = {
                amount: "abc"
            };

            let expression = {
                amount: mapData.asInt("amount")
            };

            let result = mapData(expression, data);

            expect(result).toEqual({
                amount: NaN
            });
        });

        test("Value can not be converted and has default value, then return default value", () => {
            let data = {
                amount: "abc"
            };

            let expression = {
                amount: mapData.asInt("amount", 123)
            };

            let result = mapData(expression, data);

            expect(result).toEqual({
                amount: 123
            });
        });
    });

    describe("coalesce", () => {
        test("Coalescing a truthy value should return the value", () => {
            let data = {
                amount: 2
            };

            let expression = {
                amount: mapData.coalesce("amount", 3)
            };

            let result = mapData(expression, data);

            expect(result).toEqual({
                amount: 2
            });
        });

        test("Coalescing a falsy value should return the value", () => {
            let data = {
                amount: 0
            };

            let expression = {
                amount: mapData.coalesce("amount", 3)
            };

            let result = mapData(expression, data);

            expect(result).toEqual({
                amount: 0
            });
        });

        test("Coalescing a null value should return the default value", () => {
            let data = {
                amount: null
            };

            let expression = {
                amount: mapData.coalesce("amount", 3)
            };

            let result = mapData(expression, data);

            expect(result).toEqual({
                amount: 3
            });
        });

        test("Coalescing a undefined value should return the default value", () => {
            let data = {
                amount: undefined
            };

            let expression = {
                amount: mapData.coalesce("amount", 3)
            };

            let result = mapData(expression, data);

            expect(result).toEqual({
                amount: 3
            });
        });
    });
});