const config = require('./config');
const faker = require('faker');

const randomNum = Math.ceil(Math.random(1000) * 1000);
const fullname = faker.name.findName();
const username = `daniel${randomNum}`;
const email = faker.internet.email();

module.exports = {
  'Registers a new user': browser =>
  browser
    .url(config.url)
    .waitForElementVisible('body')
    .pause(1000)
    .click('#getStarted')
    .pause(1000)
    .waitForElementVisible('div.login-page-wrapper')
    .pause(1000)
    .click('#registerlink')
    .pause(1000)
    .assert.containsText('h3#registerlabel', 'Register')
    .pause(1000)
    .setValue('input[name=fullname]', fullname)
    .pause(1000)
    .setValue('input[name=username]', username)
    .pause(1000)
    .setValue('input[name=email]', email)
    .pause(1000)
    .setValue('input#registerPassword', '123456')
    .pause(1000)
    .setValue('input[name=passwordConfirmation]', '123456')
    .pause(1000)
    .click('#registerbutton')
    .pause(1000)
    .waitForElementVisible('div.documents-wrapper')
    .pause(1000)
    .assert.containsText('p.currentFilter', 'Showing Public documents')
    .pause(1000)
    .click('#logout'),

  'Returns error for incomplete fields': browser =>
  browser
    .waitForElementVisible('body')
    .pause(1000)
    .click('#getStarted')
    .waitForElementVisible('div.login-page-wrapper')
    .pause(1000)
    .click('#registerlink')
    .pause(1000)
    .assert.containsText('h3#registerlabel', 'Register')
    .setValue('input[name=fullname]', '')
    .pause(1000)
    .setValue('input[name=username]', username)
    .pause(1000)
    .setValue('input[name=email]', email)
    .pause(1000)
    .setValue('input#registerPassword', '123456')
    .pause(1000)
    .setValue('input[name=passwordConfirmation]', '123456')
    .pause(1000)
    .click('#registerbutton')
    .assert.containsText('p#fullnameError', 'Fullname is required')
    .pause(1000),

  'Logs a user in': browser =>
  browser
    .url(config.url)
    .waitForElementVisible('body')
    .pause(1000)
    .click('#getStarted')
    .pause(1000)
    .waitForElementVisible('div#loginform')
    .pause(1000)
    .assert.containsText('h3#loginlabel', 'Login')
    .pause(1000)
    .setValue('input[name=identifier]', 'memuna@haruna.com')
    .pause(1000)
    .setValue('input[name=password]', 'memunat')
    .pause(1000)
    .click('#loginbutton')
    .pause(1000)
    .waitForElementVisible('div.documents-wrapper')
    .pause(1000)
    .assert.containsText('p.currentFilter', 'Showing Public documents')
    .pause(1000)
    .click('#logout'),

  'Returns error for invalid credentials': browser =>
  browser
    .waitForElementVisible('body')
    .pause(1000)
    .click('#getStarted')
    .pause(1000)
    .waitForElementVisible('div#loginform')
    .pause(1000)
    .assert.containsText('h3#loginlabel', 'Login')
    .pause(1000)
    .setValue('input[name=identifier]', 'memuna@h.com')
    .pause(1000)
    .setValue('input[name=password]', 'memunat')
    .pause(1000)
    .click('#loginbutton')
    .pause(1000)
    .assert.containsText('div.errors h5', 'Invalid credentials')
    .pause(1000)
    .end()
};
