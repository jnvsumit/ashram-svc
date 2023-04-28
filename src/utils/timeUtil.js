const _ = require('underscore');

/**
 * 15m -> 900000
 * 1h -> 3600000
 * 30s -> 30000
 * @param {string} duration 
 */
const getMillisecondFromStringTime = (duration) => {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1));

    return _.result(_.findWhere([{ unit: 's', value: 1 }, { unit: 'm', value: 60 }, { unit: 'h', value: 3600 }], { unit }), 'value') * value * 1000;
}

module.exports = {
    getMillisecondFromStringTime
};