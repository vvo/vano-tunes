const fs = require('fs');
const path = require('path');
const log = require('vano-tunes-log');

exports.up = function(db) {
  const filePath = path.join(__dirname, 'sqls', '20180331201201-init-up.sql');
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      log.info(`received data: ${data}`);

      resolve(data);
    });
  }).then(data => {
    return db.runSql(data);
  });
};

exports.down = function(db) {
  const filePath = path.join(__dirname, 'sqls', '20180331201201-init-down.sql');
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      log.info(`received data: ${data}`);

      resolve(data);
    });
  }).then(data => {
    return db.runSql(data);
  });
};

exports._meta = {
  version: 1,
};
