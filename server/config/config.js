const dotenv = require('dotenv');

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
    username: 'andeladeveloper',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  }
};
