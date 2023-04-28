const _ = require('underscore');

const duration = '1h15m';
const unit = duration.slice(-1);
const value = parseInt(duration.slice(0, -1));

const durationInSeconds = _.result(_.findWhere([{ unit: 's', value: 1 }, { unit: 'm', value: 60 }, { unit: 'h', value: 3600 }], { unit }), 'value') * value;

console.log(durationInSeconds);