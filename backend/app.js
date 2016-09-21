/**
 * @author Mirko Gueregat <mgueregath@emendare.cl>
 */

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var options = {
  server: { poolSize: 5 },
  user: 'admin',
  pass: 'password',
  auth: {
    authdb: 'admin'
  }
};

var uri = "mongodb://mydomain.com:27017/taller";

mongoose.connect(uri, options);

var app = express();

const server = app.listen(3000, () => {
  console.log('listening on *:3000');
});

const io = require('socket.io')(server);


var db = mongoose.connection;
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

var User = require('./entities/user');

app.get('/user/', function(request, response, next) {
  User.find({}, function(err, users) {
    if (err || !users.length) {
      response.status(404).send({'result': false});
    } else response.status(200).send({'result': true, 'data': users});
  })
});

app.get('/user/:id', function(request, response, next) {
  var id = request.params.id;
  User.find({_id: id}, function(err, user) {
    if (err || !user.length) {
      response.status(404).send({'result': false});
    } else response.status(200).send({'result': true, 'data': user});
  })
});

app.post('/user/', function(request, response, next) {
  var newUser = new User(request.body);
  newUser.save(function(err) {
    if (err) {
      response.status(400).send({'result': false});
    } else {
      io.emit('new_user', newUser);
      response.status(201).send({'result': true, 'data': newUser});
    }
  });

});

app.put('/user/:id', function (request, response, next) {
  var id = request.params.id;
  var editUser = {$set: request.body};
  var query = {"_id": id};
  var options = {upsert: true, "new": true};
  User.findOneAndUpdate(query, editUser, options, function(err, user) {
    if (err) {
      response.status(400).send({'result': false});
    } else {
      io.emit('edit_user', user);
      response.status(202).send({'result': true, 'data': user});
    }
  });
});

app.delete('/user/:id', function (request, response, next) {
  var id = request.params.id;
  User.remove({_id: id}, function(err, result) {
    if (err) {
      response.status(400).send({'result': false});
    }
    if(!result) {
      response.status(400).send({'result': false});
    }
    io.emit('delete_user', id);
    response.status(202).send({'result': true});
  });
});

module.exports = app;
