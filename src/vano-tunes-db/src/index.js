const env = require('vano-tunes-env');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
module.exports = pool;
