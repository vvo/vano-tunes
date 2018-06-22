const https = require('https');
const fetch = require('node-fetch');

module.exports = {
  getAccessToken({ refreshToken, clientSecret, clientId }) {
    return fetch('https://accounts.spotify.com/api/token', {
      body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      method: 'POST',
      agent: https.globalAgent,
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        return res.access_token;
      });
  },
  async getPaginatedData({ accessToken, startUrl }) {
    const items = [];
    let nextPageUrl = startUrl;

    while (nextPageUrl !== null) {
      const pageData = await fetch(nextPageUrl, {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
        agent: https.globalAgent,
      }).then(res => {
        return res.json();
      });

      items.push(...pageData.items);
      nextPageUrl = pageData.next;
    }

    return items;
  },
};
