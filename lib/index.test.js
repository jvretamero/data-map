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
    test("Selector change the object data context", () => {
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