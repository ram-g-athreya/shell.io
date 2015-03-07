'use strict';

require.config({
    paths: {
        'baseUrl': '.',
        //Scripts
        'lib': 'js/lib',
        'guides': 'js/guides',
        //Bower Components
        'w2ui': 'bower_components/w2ui/w2ui-1.4.1.min',
        'introjs': 'bower_components/intro.js/intro',
        'treeview': 'bower_components/bootstrap-treeview/src/js/bootstrap-treeview',
        'cm': 'bower_components/codemirror',
        'jquery': 'bower_components/jquery/jquery.min'
    }
});

require([
    'lib/ide'
], function(ide) {
    new ide({
        selector: 'ide',
        tree: 'tree',
        terminal: 'terminal',
        editor: 'editor'
    });
});