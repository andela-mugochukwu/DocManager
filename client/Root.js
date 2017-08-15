
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./components/container/RootProd');
} else {
  module.exports = require('./components/container/RootDev');
}
