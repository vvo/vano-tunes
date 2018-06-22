const path = require('path');
const bunyan = require('bunyan');
const bunyanDebugStream = require('bunyan-debug-stream');

const stream = bunyanDebugStream({
  basepath: path.join(__dirname, '../../..'),
});

function createLogger({ name }) {
  return bunyan.createLogger({
    name,
    streams: [
      {
        level: process.env.LOG_LEVEL || 'debug',
        type: 'raw',
        stream,
      },
    ],
    serializers: bunyanDebugStream.serializers,
  });
}

module.exports = createLogger({ name: 'vano-tunes' });
