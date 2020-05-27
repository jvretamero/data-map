# map-data

> Transform data, the easy way

This library is mainly for JSON transformation, but it should work with HTML too.

## Example

Notice that these are just a few exampes, [check here](DOCUMENTATION.md) for complete documentation.

### JSON

`data-map` doesn't care from where the data cames, so you are in charge of this task.

Imagine that you have this JSON:

```json
{
    "id": 123,
    "title": "Introduction to map-data",
    "author": {
        "name": "John Doe",
        "birth": "1991-06-01"
    },
    "publishedAt": "2020-01-01"
}
```

You can extract a new JSON from it:

```js
const mapData = require("map-data");

let expression = {
    name: "author.name"
};

let newJson = mapData(expression, data); // The data variable can come from wherever you want
```

Now your `result` variable will have this value:

```json
{
    "name": "John Doe"
}
```

### Other format

Not working with a JSON data source? Provide your own `mapFn`. Here is an example to work with [cheerio](https://github.com/cheeriojs/cheerio).

```js
const mapData = require("map-data");
const cheerio = require("cheerio");

let expression = {
    name: "li.author"
};

let config = {
    mapFn: (expr, data) => cheerio(expr, data); // This function will be called every time it needs to evaluate the property's expression
};

let newJson = mapData(expression, data, config);
```

## License

[MIT](LICENSE)
