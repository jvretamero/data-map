# map-data

Transform data, the easy way

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js v12 or higher

### Installing

The project is not published yet, so you will need to clone and install it using the command below.

```txt
npm install <folder>
```

## Running the tests

There is a task called `test`, so a simple `npm run test` should be fine.

## Usage

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

## Built Using

* [NodeJs](https://nodejs.org/) - Server Environment

## Authors

* [@jvretamero](https://github.com/jvretamero) - Idea & Initial work

See also the list of [contributors](/contributors) who participated in this project.

## License

This project is licensed under the `MIT License` - see the [LICENSE.md](/LICENSE) file for details

## Acknowledgements

This project was inspired by:

* [scrape-it](https://github.com/IonicaBizau/scrape-it)
* [X-Ray](https://github.com/matthewmueller/x-ray)
* [Jason the Miner](https://github.com/mawrkus/jason-the-miner)
