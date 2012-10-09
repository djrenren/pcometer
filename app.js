
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function decrement(){
  if(val > 0)
    val -= 20;
  if(val < 0)
    val = 0;
  io.sockets.in('').emit('bump',val);
  timer = setTimeout(decrement,10000);
}

var io = require('socket.io').listen(server)
  , val = 0
  , timer;
io.sockets.on('connection', function (socket) {
  socket.emit('bump',val);
  socket.on('bump', function (data) {
    val += 15;
    if(val > 180)
      val=180
    try{
      clearTimeout(timer);
    }
    catch(err){};
    timer = setTimeout(decrement, 10000);
    io.sockets.in('').emit('bump', val);
  });
});
