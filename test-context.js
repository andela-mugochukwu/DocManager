var context = require.context('./spec', true, /run\.js$/);
context.keys().forEach(context);
