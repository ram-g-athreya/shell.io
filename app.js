;
var express = require('express'),
        http = require('http'),
        path = require('path'),
        io = require('socket.io'),
        terminal = require('term.js'),
        sessionStore = new express.session.MemoryStore(),
        cookieParser = express.cookieParser('your secret sauce');

app = express();
app.dir = __dirname;

app.configure(function() {
    // all environments
    app.set('port', process.env.PORT || 3000);
    app.engine('html', require('ejs').renderFile);

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(terminal.middleware());

    app.set('views', __dirname + '/app/views');
    app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

    app.use('/css', express.static(path.join(__dirname, '/public/css')));
    app.use('/js', express.static(path.join(__dirname, '/public/js')));

    app.use(express.errorHandler());

    app.use(cookieParser);
    app.use(express.session({store: sessionStore}));

    require('./routes')();
});

//app.get('/', routes.index);
//app.post('/connect', routes.index.connect);

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
app.server = server;

var io = require('socket.io').listen(server);

//Required for things to work no idea why
if (!~process.argv.indexOf('-n')) {
    app.server.on('connection', function(socket) {

    });
}
app.ssh = require('./app/lib/ssh');
var connect = require('./app/lib/connect').start(io, sessionStore, cookieParser);
