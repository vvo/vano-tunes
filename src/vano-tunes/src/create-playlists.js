const env = require('vano-tunes-env');
const log = require('vano-tunes-log');
const spotify = require('./spotify');

log.debug('Creating spotify playlists');

run();
async function run() {
  const spotifyAccessToken = await spotify.getAccessToken({
    refreshToken: env.SPOTIFY_REFRESH_TOKEN,
    clientSecret: env.SPOTIFY_CLIENT_SECRET,
    clientId: env.SPOTIFY_CLIENT_ID,
  });

  const playlists = await spotify.getPaginatedData({
    startUrl: 'https://api.spotify.com/v1/me/playlists',
    accessToken: spotifyAccessToken,
  });

  // store last synced song in DB (flag or state table)
  // Next step: define flow

  // VanoTunes March 2018 - Last update 2018-03-01 2PM (Paris)

  // New songs this month (never aired before)
  // Unique songs this month
  // Weekly never aired before (weekly playlist)
  // Previous week

  // test this query, is it unique for this month or since the begining?
  // might be easier
  // const newSongsThisMonth = db.query(
  //   pgFormat(`
  //   SELECT * FROM (
  //     SELECT DISTINCT ON (spotify_track_id, air_date_month) *,
  //       date_trunc('month', air_date AT TIME ZONE 'Europe/Paris') AS air_date_month
  //     FROM aired_songs
  //     WHERE air_date >= timestamp '2018-01-01 00:00:00 Europe/Paris'
  //     AND spotify_track_id IS NOT NULL
  //     ORDER BY spotify_track_id, air_date_month, air_date
  //   ) AS unique_songs_per_month
  //   ORDER BY air_date;`)
  // );
}
