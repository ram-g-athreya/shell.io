;
var connect = {
    start: function(io, sessionStore, cookieParser) {
        var SessionSockets = require('session.socket.io'),
                sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

        sessionSockets.on('connection', function(err, socket, session) {
            app.ssh.initialize(socket);
        });
    }
};

module.exports = connect;