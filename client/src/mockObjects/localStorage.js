/**
 * Mocks localstorage
 */
class LocalStorageMock {
  /**
   * the constructor
   */
  constructor() {
    this.store = {};
  }
/**
 * clears the localstorage
 * @return {void} returns null
 */
  clear() {
    this.store = {};
  }

/**
 * get item in the localstorage
 * @param {string} key - The key to the item in the localstorage
 * @return {string} returns the key to the item in localstorage
 */
  getItem(key) {
    return this.store[key];
  }
/**
 * set the value of an item in the localstorage class
 * @param {string} key - The key to the item in the localstorage
 * @param {string} value - The value of the item in the localstorage
 * @return {null} returns null
 */
  setItem(key, value) {
    this.store[key] = value;
  }

  /**
 * remove item in the localstorage class
 * @param {string} key - The key to the item in the localstorage
 * @return {void} returns nothing
 */
  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();
export default global.localStorage;
