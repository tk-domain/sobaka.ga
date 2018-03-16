(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var urls = {
            spb: {
                topLeft: 'http://ad.adriver.ru/cgi-bin/click.cgi?sid=1&ad=652546&bt=22&pid=2719859&bid=5517492&bn=5517492&rnd=237880925',
                topRight: 'http://ad.adriver.ru/cgi-bin/click.cgi?sid=1&ad=651871&bt=22&pid=2713343&bid=5487869&bn=5487869&rnd=1465879503',

                mobileMenuTop: 'http://ad.adriver.ru/cgi-bin/click.cgi?sid=1&ad=652546&bt=22&pid=2719859&bid=5517492&bn=5517492&rnd=237880925',
                mobileMenuBottom: 'http://ad.adriver.ru/cgi-bin/click.cgi?sid=1&ad=651871&bt=22&pid=2713343&bid=5487869&bn=5487869&rnd=1465879503',

                siteIndexLeft: '',
                siteIndexRight: ''
            }
        };

        var elems = {
            topLeft: document.querySelector('.b-head-banner--left') || document.querySelectorAll('.b-head-banner')[0],
            topRight: document.querySelector('.b-head-banner--right') || document.querySelectorAll('.b-head-banner')[1],

            mobileMenuTop: document.querySelectorAll('.b-main-menu__banner')[0],
            mobileMenuBottom: document.querySelectorAll('.b-main-menu__banner')[1],

            siteIndexLeft: document.querySelector('.b-body-content__head-banner--left'),
            siteIndexRight: document.querySelector('.b-body-content__head-banner--right')
        };

        var city = getCityFromUrl();

        if (city) {
            var bannerUrlsForCity = urls.hasOwnProperty(city) ? urls[city] : null;

            if (!bannerUrlsForCity) {
                return;
            }

            for (var pos in bannerUrlsForCity) {
                if (bannerUrlsForCity.hasOwnProperty(pos)) {
                    var url = bannerUrlsForCity[pos];

                    var banner = elems.hasOwnProperty(pos) ? elems[pos] : null;

                    if (!banner) {
                        continue;
                    }

                    var bannerA = banner.querySelector('a');

                    if (!bannerA) {
                        continue;
                    }

                    var href = bannerA.getAttribute('href');

                    if (!href || href === '#') {
                        bannerA.setAttribute('href', url);
                    }
                }
            }
        }

        function getCityFromUrl() {
            var pathParts = window.location.pathname.split('/');

            var cityList = window.sobaka && window.sobaka.cities || {};

            var city = 'spb';

            for (var i = 0; i < pathParts.length; i++) {
                var pathPart = pathParts[i];

                if (cityList.hasOwnProperty(pathPart)) {
                    city = pathPart;

                    break;
                }
            }

            return city;
        }
    });
})();