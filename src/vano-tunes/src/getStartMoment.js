const env = require('vano-tunes-env');
const db = require('vano-tunes-db');
const moment = require('moment-timezone');

module.exports = async function getStartMoment() {
  const { rows } = await db.query(
    `SELECT air_date from aired_songs
ORDER BY air_date DESC
LIMIT 1`
  );

  if (rows.length === 1) {
    return moment(rows[0].air_date)
      .tz('Europe/Paris')
      .minute(0)
      .second(0)
      .add(1, 'hours');
  }

  return moment.tz(env.CRAWL_START_MOMENT, 'Europe/Paris');
};
