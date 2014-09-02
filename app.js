var express = require('express'),
    app     = express(),
    server  = app.listen(3000),
    socket  = require('socket.io'),
    io      = socket.listen(server);

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

app.use(function (req, res, next) {
  res.locals.url = req.protocol + "://" + req.get('host');
  next();
});

app.get('/', function (req, res) {
  res.render('index');
});

var arrows = [];

io.on('connection', function (socket) {

  socket.on('connected', function () {
    socket.emit('data', arrows);
  });

  socket.on('position', function (position) {
    arrows = arrows.filter(function (arrow) {
      return arrow.id !== socket.id;
    });

    arrows.push({ id: socket.id, x: position.x, y: position.y });

    socket.broadcast.emit('data', arrows);
  });

  socket.on('disconnect', function () {
    arrows = arrows.filter(function (arrow) {
      return arrow.id !== socket.id;
    });

    socket.broadcast.emit('data', arrows);
  });
});
