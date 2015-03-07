//'use strict';

define(['term'], function() {
    return function(options) {
        require([
            '/socket.io/socket.io.js',
            'lib/term'
        ], function(io) {
            var socket = io.connect();
            socket.on('connect', function() {
                Terminal.colors[0] = '#000000';
                Terminal.colors[1] = '#ff0000';

                var element = $('.' + options.selector);

                var term = new Terminal({
                    colors: Terminal.tangoColors,
                    //rows: 10,
                    useStyle: true,
                    screenKeys: false,
                    cursorBlink: true
                });
                term.setMode(7);
                
                term.on('data', function(data) {
                    socket.emit('data', data);
                });

                term.on('title', function(title) {
                    document.title = title;
                });

                term.open(element[0]);
                var ascii = "   _____ _          _ _   _____ ____  \r" +
                 "  / ____| |        | | | |_   _/ __ \ \r" +
                 " | (___ | |__   ___| | |   | || |  | |\r" +
                 "  \___ \| '_ \ / _ \ | |   | || |  | |\r" +
                 "  ____) | | | |  __/ | |_ _| || |__| |\r" +
                 " |_____/|_| |_|\___|_|_(_)_____\____/ \r";
                
                //term.write('\x1b[31m ' + ascii + ' \x1b[m\r\n');
                
                term.write('\x1b[31m Shell.IO \x1b[m\r\n');
                term.resizeTerminal = function() {
                    var terminal_height = $('.' + options.selector + ' .terminal').height();
                    
                    var line_height = $('.' + options.selector + ' .terminal div').height();
                    var line_width = $('.' + options.selector + ' .terminal div').width();
                    
                    var cols = Math.round(terminal_height / line_height);
                    //Generally one character occupies 7 pixels
                    var rows = Math.round(line_width / 7);
                    term.resize(rows, cols);
                };

                term.resizeTerminal();

                socket.on('data', function(data) {
                    term.write(data);
                });

                socket.on('disconnect', function() {
                    console.log('disconnected');
                    term.destroy();
                });
                
                options.cb({
                    terminal: term,
                    socket_id: socket.id
                });
            });
        });
    };
});
