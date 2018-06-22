const moment = require('moment-timezone');
module.exports = function getEndMoment() {
  return moment()
    .tz('Europe/Paris')
    .add(1, 'hours')
    .minute(0);
};
