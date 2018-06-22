const http = require('http');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const moment = require('moment');
const env = require('vano-tunes-env');
const log = require('vano-tunes-log');

module.exports = async function crawl({
  date,
  month,
  year,
  hour,
  minute,
  formBuildId,
}) {
  const res = await fetch(env.CRAWL_URL, {
    body: `form_build_id=${formBuildId}&form_id=cqctform&day=${date}&month=${month +
      1}&year=${year}&hour=${hour}&minutes=${minute}`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    method: 'POST',
    agent: http.globalAgent,
  });

  const $ = cheerio.load(await res.text());

  // check the loaded page is the right one
  const pageMoment = moment({
    date: parseInt($('[name=day] option[selected]').val(), 10),
    month: parseInt($('[name=month] option[selected]').val(), 10) - 1,
    year: parseInt($('[name=year] option[selected]').val(), 10),
    hour: parseInt($('[name=hour] option[selected]').val(), 10),
    minute: parseInt($('[name=minutes] option[selected]').val(), 10),
    second: 0,
  }).tz('Europe/Paris');
  const pageMomentFormatted = `${pageMoment.format(
    'YYYY-MM-DD HH:mm:00'
  )} Europe/Paris`;

  log.trace(`Page moment: `);

  if (
    pageMoment.get('date') !== date ||
    pageMoment.get('month') !== month ||
    pageMoment.get('year') !== year ||
    pageMoment.get('hour') !== hour ||
    pageMoment.get('minute') !== minute
  ) {
    throw new Error(
      `vano-tunes: Loaded page is different from what was asked, aborting.`
    );
  }

  const songs = $('.section-cqct .row > div')
    .map(function() {
      const $song = $(this);
      const $spotifyTrack = $song.find('.socicon-spotify');
      const $deezerTrack = $song.find('.socicon-deezer');

      const songAirHourMinute = $song
        .find('time')
        .text()
        .split(':');
      const parsedSongAirHour = parseInt(songAirHourMinute[0], 10);
      const parsedSongAirMinute = parseInt(songAirHourMinute[1], 10);
      const airMoment = moment({
        date,
        month,
        year,
        hour: 0,
        minute: 0,
        second: 0,
      });

      // On the website, when you ask 10am, you get songs between 9am and ~10am,
      // along with any songs before 9am to fill up the list
      // Wich means that when you ask 1am, you get songs between midnight and 1am
      // along with any songs before midnight, so sometimes you get songs from 11pm which is the day before
      // we have to account for that
      if (parsedSongAirHour >= hour + 1) {
        airMoment.subtract(1, 'days');
      }

      airMoment.hour(parsedSongAirHour);
      airMoment.minute(parsedSongAirMinute);

      const airMomentFormatted = `${airMoment.format(
        'YYYY-MM-DD HH:mm:ss'
      )} Europe/Paris`;

      return {
        artist: $song.find('.name').text(),
        title: $song.find('.description').text(),
        airDate: airMomentFormatted,
        pageDate: pageMomentFormatted,
        spotifyTrackId:
          $spotifyTrack[0] === undefined
            ? null
            : $spotifyTrack
                .attr('href')
                .split('/')
                .pop(),
        deezerTrackId:
          $deezerTrack[0] === undefined
            ? null
            : $deezerTrack
                .attr('href')
                .split('/')
                .pop(),
      };
    })
    .get();
  return songs;
};
