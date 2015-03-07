'use strict';

define(function() {
    return function(options) {
        require(['introjs'], function(introJs) {
            var introjs = new introJs();
            introjs.setOptions({
                steps: options.steps,
                showBullets: false
            });
            options.cb(introjs);
        });
    };
});
