;
var ssh = {
    buff: {},
    term: {},
    socket: {},
    cb: {},
    useCb: {},
    //Used by both socket and SSH - Need to understand how to use it properly
    openSSHSession: function(options) {
        /**
         * Open Terminal
         */
        var me = this;
        var id = options.socket.id;
        var Connection = require('ssh2');
        var conn = new Connection();

        var cb_response = '';

        conn.on('ready', function() {
            conn.shell('uptime', function(err, conn_stream) {
                if (err)
                    throw err;
                options.success();
                me.term[id] = conn_stream;
                conn_stream.on('close', function() {
                    console.log('Stream :: close');
                    conn.end();
                }).on('data', function(data) {
                    data = data.toString();
                    console.log(data.length, data);

                    if (!options.socket) {
                        return me.buff[id].push(data);
                    }
                    else {

                        //If callback exists
                        if (me.cb[id]) {

                            if (data.indexOf('ubuntu@') >= 0 && me.useCb[id]) {
                                me.useCb[id] = false;
                                me.cb[id](cb_response);
                            }

                            if (me.useCb[id]) {
                                cb_response += data;
                            }
                            
                            if (data == '\r\n' && me.useCb[id] == false) {
                                cb_response = '';
                                me.useCb[id] = true;
                            }
                            
                        }
                        return options.socket.emit('data', data);
                    }
                }).stderr.on('data', function(data) {
                    console.log('STDERR: ' + data);
                });
            });
        });

        conn.on('keyboard-interactive', function(name, instructions, instructionsLang, prompts, finish) {
            finish([options.password]);
        });

        conn.connect({
            host: options.host,
            port: 22,
            tryKeyboard: false,
            username: options.username,
            privateKey: require('fs').readFileSync('Oregon.pem')
        });

        conn.on('error', function(e) {
            //Connection error
        });

        while (this.buff[id].length) {
            options.socket.emit('data', this.buff[id].shift());
        }
    },
    initialize: function(socket) {
        var id = socket.id;
        var me = this;
        this.buff[id] = Array();
        this.term[id] = null;
        this.socket[id] = socket;

        socket.on('data', function(data) {
            //Wait until terminal is available
            while (!me.term[id])
                ;
            me.term[id].write(data);
        });
        socket.on('disconnect', function() {

        });
    }
};

module.exports = ssh;
