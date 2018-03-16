(function(window, document, undefined) {
    var CITY_COOKIE_NAME = '_sobaka_city';

    var ADFOX_CITY_COOKIE_NAME = '_sobaka_adfox_city';

    if (cookiesAreEnabled()) {
        init();
    }

    function init() {
        var city = getCookie(CITY_COOKIE_NAME);

        if (city && cityShouldBeKept(city)) {
            return;
        }

        var adfoxCity = getCookie(ADFOX_CITY_COOKIE_NAME);

        if (adfoxCity) {
            return;
        }

        getAdfoxLoaderScript(defineAdfoxCity);
    }

    function cityShouldBeKept(city) {
        var citiesToKeep = ['sochi'];

        for (var i = 0; i < citiesToKeep.length; i++) {
            if (city === citiesToKeep[i]) {
                return true;
            }
        }

        return false;
    }

    function getAdfoxLoaderScript(callback) {
        var src = 'https://yastatic.net/pcode/adfox/loader.js';

        var scripts = document.getElementsByTagName('script');

        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src.indexOf(src) > -1) {
                callback();

                return;
            }
        }

        var script = document.createElement('script');

        script.src = src;

        script.async = true;

        script.onreadystatechange = script.onload = function() {
            if (!callback.done && (!script.readyState || /loaded|complete/.test(script.readyState))) {
                callback.done = true;

                callback();
            }
        };

        document.querySelector('head').appendChild(script);
    }

    function defineAdfoxCity() {
        var adfoxCodesManager = window.Ya && window.Ya.adfoxCode ? window.Ya.adfoxCode : null;

        if (!adfoxCodesManager) {
            return;
        }

        var detectionStartedAt = window.Date.now();

        var bannerId = 'adfox_1485945907228772';

        var banner = document.getElementById(bannerId);

        if (!banner) {
            banner = document.createElement('div');

            banner.setAttribute('id', bannerId);

            document.body.insertBefore(banner, document.body.firstChild);
        }

        banner.style.position = 'absolute';
        banner.style.top = '-10000px';
        banner.style.left = '-10000px';

        adfoxCodesManager.create({
            ownerId: 253407,
            containerId: bannerId,
            params: {
                pp: 'g',
                ps: 'ckur',
                p2: 'fnmb'
            },
            onRender: function() {
                var city = banner.querySelector('div > div > a > img').getAttribute('alt');

                if (cityIsNotValid(city)) {
                    return;
                }

                saveAdfoxCityToCookie(city);

                if (city === getCookie(CITY_COOKIE_NAME)) {
                    return;
                }

                var detectionEndedAt = window.Date.now();

                var secondsPassed = window.Math.floor((detectionEndedAt - detectionStartedAt) / 1000);

                if (secondsPassed < 3) {
                    saveCityToCookie(city);

                    if (cityIsAllowedToBeRedirectedTo(city)) {
                        reloadPage();
                    }

                    return;
                }

                if (secondsPassed < 10) {
                    saveCityToCookie(city);

                    return;
                }
            },
            onError: function(error) {
                console.error(error);
            }
        });
    }

    function cityIsNotValid(city) {
        var availableCities = window.sobaka && window.sobaka.cities || {};

        return !(city && availableCities.hasOwnProperty(city));
    }

    function cityIsAllowedToBeRedirectedTo(city) {
        var allowedCities = window.sobaka && window.sobaka.allowedCities || [];

        if (!allowedCities.length) {
            return true;
        }

        for (var i = 0; i < allowedCities.length; i++) {
            if (city === allowedCities[i]) {
                return true;
            }
        }

        return false;
    }

    function saveCityToCookie(city) {
        setCookie(CITY_COOKIE_NAME, city, { path: '/', expires: 365 });
    }

    function saveAdfoxCityToCookie(city) {
        setCookie(ADFOX_CITY_COOKIE_NAME, city, { path: '/', expires: 365 });
    }

    function cookiesAreEnabled() {
        var isCookieEnabled = window.navigator.cookieEnabled;

        if (!isCookieEnabled) {
            document.cookie = 'testcookie';

            isCookieEnabled = document.cookie.indexOf('testcookie') != -1;
        }

        return isCookieEnabled;
    }

    function getCookie(name) {
        var matches = document.cookie.match(new window.RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));

        return matches ? window.decodeURIComponent(matches[1]) : undefined;
    }

    function setCookie(name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires === 'number' && expires) {
            var d = new window.Date();

            d.setMilliseconds(d.getMilliseconds() + expires * 864e+5);

            expires = options.expires = d;
        }

        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = window.encodeURIComponent(value);

        var updatedCookie = name + '=' + value;

        for (var propName in options) {
            if (options.hasOwnProperty(propName)) {
                updatedCookie += '; ' + propName;

                var propValue = options[propName];

                if (propValue !== true) {
                    updatedCookie += '=' + propValue;
                }
            }
        }

        document.cookie = updatedCookie;
    }

    function reloadPage() {
        window.location.reload();
    }
})(window, document);