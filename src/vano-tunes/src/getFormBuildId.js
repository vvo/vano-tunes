const http = require('http');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const env = require('vano-tunes-env');

module.exports = async function getFormBuildId() {
  const res = await fetch(env.CRAWL_URL, {
    agent: http.globalAgent,
  });

  const $ = cheerio.load(await res.text());
  return $('[name=form_build_id]').attr('value');
};
