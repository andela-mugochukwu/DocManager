'use strict';

var dotenv = require('dotenv');

dotenv.config();
module.exports = {
  development: {
    username: 'andeladeveloper',
    password: null,
    database: 'docman',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    use_env_variable: 'TEST_DATABASE_URL',
    dialect: 'postgres'
  },
  test1: {
    use_env_variable: 'TEST_DB',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  }
};