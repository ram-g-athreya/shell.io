'use strict';

define(function() {
    return function(options) {
        $('.' + options.selector).html('<ul class="directory-list"></ul>');
        this.setData = function(data) {
            var ul = $('.' + options.selector + ' ul');
            ul.html('');
            for (var index in data) {
                ul.append('<li data="' + data[index] + '" class="directory-item">' + data[index] + '</li>');
            }
        };

        if (options.data) {
            this.setData(options.data);

            $('.directory-item').click(function() {
                var file = $(this).text();
                options.ide.exec({
                    command: 'cat',
                    data: {
                        file: file
                    },
                    success: function(content) {
                        options.ide.createTab({
                            title: file,
                            content: content
                        });
                    }
                });
            });
        }
    };
});