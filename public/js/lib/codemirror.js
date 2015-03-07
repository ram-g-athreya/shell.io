'use strict';

define(function() {
    return function(options) {
        var config = [
            'cm/lib/codemirror',
            'cm/addon/dialog/dialog',
            'cm/addon/search/search',
            'cm/addon/edit/closebrackets',
            'cm/addon/edit/matchbrackets'
        ], mode;
        var file_type = options.file.split('.').pop();

        switch (file_type) {
            case 'js':
                mode = 'javascript';
                config.push('cm/mode/javascript/javascript');
                break;
            case 'html':
                mode = 'htmlmixed';
                config.push('cm/mode/htmlmixed/htmlmixed');
                break;
            case 'sh':
                mode = 'shell';
                config.push('cm/mode/shell/shell');
                break;
        }

        function save(content) {
            options.ide.exec({
                command: 'save',
                data: {
                    file: options.file,
                    content: content
                },
                success: function() {

                }
            });
        }

        require(config, function(CodeMirror) {
            options.cb(CodeMirror(options.node, {
                lineNumbers: true,
                mode: mode,
                matchBrackets: true,
                autoCloseTags: true,
                autoCloseBrackets: true,
                enableSearchTools: true,
                autoMatchParens: true,
                indentWithTabs: true,
                value: options.content,
                extraKeys: {
                    "Cmd-S": function(instance) {
                        save(instance.getValue());
                    },
                    "Ctrl-S": function(instance) {
                        save(instance.getValue());
                    },
                    "Cmd-E": function(instance) {
                        options.ide.tabs.closeTab('#' + options.node.id);
                    },
                    "Ctrl-E": function(instance) {
                        options.ide.tabs.closeTab('#' + options.node.id);
                    },
                    "Cmd-W": function(instance) {
                        options.ide.tabs.closeTab('#' + options.node.id);
                    },
                    "Ctrl-W": function(instance) {
                        options.ide.tabs.closeTab('#' + options.node.id);
                    }
                }
            }));
        });
    };
});


