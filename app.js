var feathers = require('feathers');
var hooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var db = require('feathers-nedb');

var app = feathers()
  // Configure REST and real-time capabilities
  .configure(feathers.rest())
  .configure(feathers.socketio())
  .configure(hooks())
  // REST endpoints can parse JSON
  .use(bodyParser.json())
  // Add a messages API endpoint
  .use('/messages', db('messages'))
  // Host the current folder
  .use('/', feathers.static(__dirname));

var messages = app.service('messages');

// Add hooks
messages.before({
  create: function(hook, next) {
    // Add the created_at date
    hook.data.created_at = new Date();
    // Go to the next step (save to database)
    next();
  },

  find: function(hook, next) {
    // Sort the result list by created_at date
    hook.params.query.$sort = { created_at: 1 };
    next();
  }
}).after({
  find: function(hook, next) {
    var size = hook.result.length;
    // Only return the last 10 messages
    hook.result = hook.result.slice(size - 10, size);
    next();
  }
});

app.listen(3030);
