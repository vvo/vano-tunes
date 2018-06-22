const path = require('path');
const log = require('vano-tunes-log');
const nodemon = require('nodemon');

process.on('uncaughtException', err => {
  console.log(err.stack);
});

process.on('unhandledRejection', err => {
  return log.error(err);
});

run();

async function run() {
  const nodemonInstance = await startNodemon();
  nodemonInstance.on('restart', () => {
    log.info('Crawler restarted');
  });
}

function startNodemon() {
  return new Promise((resolve, reject) => {
    const nodemonInstance = nodemon({
      script: require.resolve('vano-tunes/src/index.js'),
      ext: 'js json',
      watch: path.join(__dirname, 'src'),
    });

    nodemonInstance
      .once('start', () => {
        log.info('Dev env started');
        resolve(nodemonInstance);
        return;
      })
      .once('error', reject);
  });
}
