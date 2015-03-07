'use strict';

function optionsHtml() {
    function createButton(name, text, css, icon, extra) {
        return '<div type="button" name="' + name + '" class="btn btn-' + css + ' options-btn btn-sm" ' + ((extra) ? extra : '') + '>' +
                '<span class="glyphicon glyphicon-' + icon + '"></span><span class="text">' + text + '</span>' +
                '</div>';
    }

    return createButton('connect', 'Connect', 'warning', 'flash', 'data-toggle="modal" data-target="#ide-connect-modal"') +
            createButton('help', 'Help', 'danger', 'question-sign') +
            createButton('refresh', 'Refresh', 'info', 'refresh');
}

function ajaxRequest(options) {
    $.ajax({
        url: options.url,
        type: 'post',
        data: options.data,
        success: options.success
    });
}

define(function() {
    return function(options) {
        $(document).ready(function() {
            var me = this;

            function setIdeHeight() {
                var nav = $('nav');
                $('.' + options.selector)
                        .height(
                        (window.innerHeight - nav.height() - $('nav').css('marginBottom').replace('px', '') - 5) + 'px'
                        );
            }


            function setEditorHeight() {
                $('.' + options.editor + '-tab-content').css(
                        'padding-bottom', $('.' + options.editor + '-tabs').height()
                        );
            }

            function createTerminal(cb) {
                require(['lib/terminal'], function(terminal) {
                    new terminal({
                        selector: options.terminal,
                        cb: function(options) {
                            me.terminal = options.terminal;
                            me.socket_id = options.socket_id;
                            if (cb)
                                cb(options);
                        }
                    });
                });
            }

            function createTabs() {
                require(['lib/tabs'], function(tabs) {
                    tabs({
                        selector: options.editor + '-tabs',
                        cb: function(tabs) {
                            me.tabs = tabs;
                        }
                    });
                });
            }

            me.createTab = function(options) {
                me.tabs.createTab({
                    'title': options.title,
                    'cb': function(res) {
                        me.generateCodemirror({
                            node: res.pane[0],
                            content: options.content,
                            file: options.title
                        });
                    }
                });
            };

            me.generateCodemirror = function(options) {
                require(['lib/codemirror'], function(codemirror) {
                    codemirror({
                        node: options.node,
                        content: options.content,
                        fileType: options.fileType,
                        ide: me,
                        file: options.file,
                        cb: function(codemirror) {
                            //THIS AREA NEEDS TO BE REVIEWED

                            //me.codemirror = codemirror;
                        }
                    });
                });
            };

            function createDirectoryTree(data) {
                require(['lib/tree'], function(tree) {
                    me.tree = new tree({
                        selector: options.tree,
                        data: data,
                        ide: me
                    });
                });
            }

            require(['jquery', 'w2ui'], function($) {
                function editorHtml() {
                    return '<div class="' + options.editor + '">' +
                            '<div class="' + options.editor + '-tabs"></div>' +
                            '</div>';
                }

                $(window).resize(function() {
                    setIdeHeight();
                    setEditorHeight();
                    if (me.terminal) {
                        me.terminal.resizeTerminal();
                    }
                });

                $(function() {
                    setIdeHeight();
                    $('.' + options.selector)
                            .w2layout({
                        name: 'layout',
                        panels: [
                            {type: 'top', size: 60, resizable: false, style: 'overflow: hidden', content: optionsHtml()},
                            {type: 'main'}
                        ],
                        onRender: function() {
                            setEditorHeight();

                            //Create Intro
                            require(['lib/intro', 'guides/ide'], function(intro, steps) {
                                me.intro = {};
                                intro({
                                    steps: steps,
                                    cb: function(intro) {
                                        me.intro.ide = intro;
                                    }
                                });
                            });

                            //Help button click
                            $("[name=help]").click(function() {
                                me.intro.ide.start();
                            });
                        }
                    });
                    $().w2layout({
                        name: 'layout_main',
                        resizer: 7,
                        panels: [
                            {type: 'top', size: 30, resizable: false, style: 'overflow: hidden; border: none;', content: '<div id="breadcrumb"></div>'},
                            {type: 'left', size: '18%', resizable: true, style: 'padding: 0', content: '<div class="' + options.tree + '"></div>'},
                            {type: 'main', content: editorHtml()},
                            {type: 'preview', size: '40%', resizable: true, content: '<div class="' + options.terminal + '"></div>'}
                        ]
                    });
                    w2ui['layout'].content('main', w2ui['layout_main']);

                    me.exec = function(options) {
                        var data = options.data || {};
                        data.socket_id = me.socket_id;
                        setTimeout(function() {
                            ajaxRequest({
                                url: options.command + '\n',
                                data: data,
                                success: function(response) {
                                    options.success(response);
                                }
                            });
                        }, 500);
                    };

                    function setBreadCrumb(string) {
                        $('#breadcrumb').text(string);
                    }

                    function setLs() {
                        me.exec({
                            command: 'ls',
                            success: function(string) {
                                var files = string.split('\r\n');
                                files.pop();
                                createDirectoryTree(files);
                            }
                        });
                    }

                    $('#ide-connect-submit').click(function() {
                        var data = $('#ide-connect-form').serializeArray();
                        createTerminal(function(options) {
                            data.push({
                                name: 'socket_id',
                                value: me.socket_id
                            });
                            ajaxRequest({
                                url: '/connect',
                                data: data,
                                success: function() {
                                    $('#ide-connect-close').click();
                                    $('[name=help]').show();
                                    $('[name=refresh]').show();
                                    createTabs();

                                    me.exec({
                                        command: 'pwd',
                                        success: function(string) {
                                            setBreadCrumb(string);
                                            setLs();
                                        }
                                    });
                                }
                            });
                        });
                    });
                    require(['introjs', 'guides/ide'], function(intro, steps) {
                        me.intro = {};
                        intro({
                            steps: steps,
                            cb: function(intro) {
                                me.intro.ide = intro;
                            }
                        });
                    });
                    $('[name=help]').hide();
                    $('[name=help]').click(function() {
                        me.intro.ide.start();
                    });

                    $('[name=refresh]').hide();
                    $('[name=refresh]').click(function() {
                        setLs();
                    });
                });
            });
        });
    };
});