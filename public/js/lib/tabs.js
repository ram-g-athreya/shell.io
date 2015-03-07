'use strict';

define(function() {
    var tab_index = 0;

    function getTabHtml(opts) {
        /**
         * opts.title
         * opts.content
         */
        tab_index++;
        return {
            tab: '<li class="tab" data-target="#tab-page-' + tab_index + '"><span>' + opts.title + '</span>' +
                    '<button type="button" class="close" tab-index="' + tab_index + '">×</button>' +
                    '</li>',
            pane: '<div class="tab-pane" id="tab-page-' + tab_index + '">' + ((opts.content) ? opts.content : '') + '</div>'
        };
    }

    return function(options) {
        require([
            'lib/chrometab'
        ], function() {
            var selector = '.' + options.selector;
            var tabs = $(selector);
            tabs.html(
                    '<ul class="tabs">' +
                    '</ul>' +
                    '<div class="tab-content">' +
                    '</div>'
                    );

            $(selector + ' .tabs').chrometab();

            tabs.closeTab = function(target) {
                $('.tab-content ' + target).remove();
                $('.tab[data-target=' + target + ']').remove();
            };

            tabs.createTab = function(opts) {
                var html = getTabHtml(opts);

                //Adding Tab
                $(selector + ' .tabs').append(html.tab);
                $(selector + ' .tabs .tab.active').removeClass('active');

                var tab = $(selector + ' .tabs .tab').last();
                tab.addClass('active');

                //Adding Pane
                $(selector + ' .tab-content').append(html.pane);
                $(selector + ' .tab-content .tab-pane.active').removeClass('active');

                var pane = $(selector + ' .tab-content .tab-pane').last();
                pane.last().addClass('active');

                $(selector + ' .tabs').chrometab();
                opts.cb({
                    tab: tab,
                    pane: pane
                });

                $('.close').click(function() {
                    var $this = $(this);
                    var parent = $this.parent('.tab');
                    var target = parent.attr('data-target');
                    tabs.closeTab(target);
                });
            };
            options.cb(tabs);
        });
    };
});