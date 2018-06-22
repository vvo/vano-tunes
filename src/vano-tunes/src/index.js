const lodash = require('lodash');
const pgFormat = require('pg-format');
const db = require('vano-tunes-db');
const randomInt = require('random-int');
const delay = require('delay');
const log = require('vano-tunes-log');
const ProgressBar = require('progress');
const getFormBuildId = require('./getFormBuildId');
const getStartMoment = require('./getStartMoment');
const getEndMoment = require('./getEndMoment');
const crawl = require('./crawl');
run();

async function run() {
  const formBuildId = await getFormBuildId();
  const currentMoment = await getStartMoment();
  const endMoment = getEndMoment();
  const numberOfHours = endMoment.diff(currentMoment, 'hours');

  const progressBar = new ProgressBar('crawling [:bar] :percent :etas', {
    total: numberOfHours,
  });

  log.trace(`Start moment: ${currentMoment.format('YYYY-MM-DD HH:mm:00')}`);
  log.trace(`End moment: ${endMoment.format('YYYY-MM-DD HH:mm:00')}`);

  endMoment.add(1, 'hours'); // we add another hour to include it in the while loop

  while (currentMoment.isBefore(endMoment, 'hour')) {
    log.trace(`Current moment: ${currentMoment.format('YYYY-MM-DD HH:mm:00')}`);

    const songs = await crawl({
      date: currentMoment.date(),
      month: currentMoment.month(),
      year: currentMoment.year(),
      hour: currentMoment.hour(),
      minute: 0,
      formBuildId,
    });

    await db.query(
      pgFormat(
        'INSERT INTO aired_songs (artist, title, air_date, page_date, spotify_track_id, deezer_track_id) VALUES %L ON CONFLICT (artist, title, air_date) DO UPDATE SET page_date = Excluded.page_date',
        lodash
          .uniqBy(songs, song => {
            return [song.artist, song.song, song.air_date].join();
          }) // we deduplicate songs found on the page with exact same artist, title and airDate to avoid postgresql errors of values with duplicates
          .map(song => {
            return [
              song.artist,
              song.title,
              song.airDate,
              song.pageDate,
              song.spotifyTrackId,
              song.deezerTrackId,
            ];
          })
      )
    );

    await delay(randomInt(37, 110));
    currentMoment.add(1, 'hours');
    progressBar.tick();
  }

  log.debug('End crawling');

  await db.end();
}
