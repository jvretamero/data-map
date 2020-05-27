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
            return config.mapFn(selectorExpr, data);
        }

        throw new Error("InvalidSelector");
    };

    const evaluateTransform = (expr, data) => {
        let transformFn = expr[transformProp];

        if (typeof transformFn != "function")
            throw new Error("InvalidTransform");

        return transformFn(data);
    };

    const evaluateObject = (expr, data) => {
        if (expr.hasOwnProperty(selectorProp))
            data = evaluateSelector(expr, data);

        if (expr.hasOwnProperty(transformProp))
            return evaluateTransform(expr, data);

        return Object.entries(expr)
            .filter(([property]) => property != selectorProp)
            .reduce((obj, [property, value]) => {
                obj[property] = evaluate(value, data);
                return obj;
            }, {});
    };

    const evaluate = (expr, data) => {
        if (!data) return null;
        if (!expr) return data;

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