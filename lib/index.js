const pluckJson = (path, data) =>
    data && path.split(".")
        .reduce((prev, curr) => prev && prev[curr] || null, data);

const defaultConfig = {
    mapFn: pluckJson
};

const selectorProp = "_selector";
const transformProp = "_transform";

/**
 * Maps the data
 * 
 * @name mapData
 * @function
 * @param {Object|String} expr The transforming expression
 * @param {Any} data The data to be transformed
 * @param {Object} config The configuration to control some behaviours
 * @return {Object} The data as JSON
 */
const mapData = (expr, data, config = null) => {
    config = config || defaultConfig;

    const evaluateString = (expr, data) =>
        config.mapFn(expr, data);

    const evaluateSelector = (expr, data) => {
        let selectorExpr = expr[selectorProp];

        if (typeof selectorExpr == "function") {
            return selectorExpr(data);
        } else if (typeof selectorExpr == "string") {
            return evaluateString(selectorExpr, data);
        }

        throw new Error("InvalidSelector");
    };

    const evaluateTransform = (expr, data) => {
        let transformFn = expr[transformProp];

        if (typeof transformFn != "function")
            throw new Error("InvalidTransform");

        return transformFn(data);
    };

    const cloneWithoutProperty = (object, property) => {
        let newObject = Object.assign({}, object);
        delete newObject[property];
        return newObject;
    };

    const evaluateObject = (expr, data) => {
        if (expr.hasOwnProperty(selectorProp)) {
            data = evaluateSelector(expr, data);
            expr = cloneWithoutProperty(expr, selectorProp);
        }

        if (Array.isArray(data))
            return mapArray(expr, data);

        if (expr.hasOwnProperty(transformProp))
            return evaluateTransform(expr, data);

        return Object.entries(expr)
            .reduce((obj, [property, value]) => {
                obj[property] = evaluate(value, data);
                return obj;
            }, {});
    };

    const mapArray = (expr, array) =>
        array && array.map(item => evaluate(expr, item));

    const evaluate = (expr, data) => {
        if (!data) return null;
        if (!expr) return data;

        if (Array.isArray(data))
            return mapArray(expr, data);

        if (typeof expr == "object") {
            return evaluateObject(expr, data);
        } else if (typeof expr == "string") {
            return evaluateString(expr, data);
        }

        return null;
    };

    return evaluate(expr, data);
};

module.exports = mapData;