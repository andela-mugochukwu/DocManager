// Specify to enable development support in the store during
// development
// if (process.env.NODE_ENV === 'production') {
//   module.exports = prodStore;
// } else {
//   module.exports = devStore;
// }
// Specify to enable development support in the store during
// development
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configureStore.prod');
} else {
  module.exports = require('./configureStore.dev');
}
