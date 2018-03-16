var countersApi = countersApi || (function($, _, document, window, undefined) {
    'use strict';

    var RELOAD_THROTTLING_TIME = 800;

    $(function() {
        initGlobalReloadControls();
    });

    // Global API
    var countersApi = {};

    countersApi.reloadAll = _.throttle(function(data) {
        data = data || {};

        var url = data.url || window.location.pathname;

        var title = data.title || document.title;

        var referrer = data.referrer || document.referrer;

        var Ya = window.Ya;

        if (Ya) {
            // Yandex Metrika
            var metrika = Ya._metrika;

            if (metrika && metrika.counters) {
                var counters = metrika.counters;

                for (var prop in counters) {
                    if (counters.hasOwnProperty(prop)) {
                        var counter = counters[prop];

                        counter.hit(url, {title: title, referer: referrer});
                    }
                }
            }

            // Yandex Adfox
            var adfox = Ya.adfoxCode;

            if (adfox && typeof adfox.reload === 'function') {
                adfox.reload();
            }
        }

        // Google Analytics
        var ga = window.ga;

        if (typeof ga === 'function') {
            ga('set', {
                page: url,
                title: title
            });

            ga('send', 'pageview');
        }

        // TNS
        var tnsCounter = window.tnsCounterTimeout_ru;

        if (tnsCounter && typeof tnsCounter.hit === 'function') {
            tnsCounter.hit();
        }

        // Mediator
        var mediator = window._mediator;

        if (mediator) {
            mediator.stop();
            mediator.start({
                target: data.container,
                url: url
            });
        }
    }, RELOAD_THROTTLING_TIME, { trailing: false });

    return countersApi;

    function initGlobalReloadControls() {
        $(document).on('click', '.reloadCounters', function() {
            countersApi.reloadAll();
        });
    }
})($, _, document, window);