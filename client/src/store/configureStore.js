import * as devStore from './configureStore.dev';
import * as prodStore from './configureStore.prod';
// Specify to enable development support in the store during
// development
if (process.env.NODE_ENV === 'production') {
  module.exports = prodStore;
} else {
  module.exports = devStore;
}
