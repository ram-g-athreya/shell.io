;
module.exports = function() {
    app.get('/', function(req, res) {
        res.render('index.html', {title: 'Shell.io'});
    });
    app.post('/connect', function(req, res) {
        if (app.ssh) {
            app.ssh.openSSHSession({
                host: req.param('host') || 'ec2-54-159-134-220.compute-1.amazonaws.com',
                auth_type: req.param('auth-type'),
                username: req.param('username') || 'ubuntu',
                socket: app.ssh.socket[req.param('socket_id')],
                success: function() {
                    res.end();
                }
            });
        }
    });

    function exec(req, res, command) {
        var param = req.param('socket_id');
        var term = app.ssh.term[param];

        term.write('sudo ' + command + '\n');
        
        app.ssh.useCb[param] = false;
        app.ssh.cb[param] = function(data) {
            app.ssh.cb[param] = null;
            res.end(data);
        };
    }

    app.post('/pwd', function(req, res) {
        exec(req, res, 'pwd');
    });

    app.post('/ls', function(req, res) {
        exec(req, res, 'ls -1');
    });
    
    app.post('/cat', function(req, res) {
        exec(req, res, 'cat ' + req.param('file'));
    });
    
    app.post('/save', function(req, res) {
        exec(req, res, 'echo "' + req.param('content') + '" > ' + req.param('file'));
    });
};