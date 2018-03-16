var bannersApi = bannersApi || (function($, _, document, window, undefined) {
    'use strict';

    var RELOAD_THROTTLING_TIME = 800;

    var MAIN_BANNER_ID = 'adriver_banner';

    var BRAND_BANNER_ID = 'adriver_brand';

    var SIDE_BANNER_ID = 'adriver_banner_240x400';

    var FULLSCREEN_BANNER_ID = 'fullscreen';

    $(function() {
        if (!adriver || adriver.isFake) {
            return;
        }

        // Serves as an entry point for the top and side banners
        initMainBanner();

        initGlobalReloadControls();

        // Should be here while we need the liveInternet counter to be initialized on page load
        reloadCodeCounters();
    });

    // Global API
    var bannersApi = {};

    bannersApi.reloadAll = _.throttle(function() {
        if (!adriver || adriver.isFake) {
            return;
        }

        reloadMainBanner();

        reloadStandaloneVisibleBanners(); // Banners which are not managed through the main banner and which are currently visible to the user

        reloadCodeCounters();

        removeAdriverGarbage();
    }, RELOAD_THROTTLING_TIME, { trailing: false });

    return bannersApi;

    function initMainBanner() {
        var banner = adriver(MAIN_BANNER_ID);

        if (! banner) {
            banner = new adriver(MAIN_BANNER_ID, {
                bn: 13,
                sid: 94027,
                sz: window.siteZone,
                bt: 52
            });

            banner.onLoadComplete(onMainBannerLoadComplete);
        }
    }

    function reloadMainBanner() {
        var banner = adriver(MAIN_BANNER_ID);

        if (! banner) {
            initMainBanner();

            return;
        }

        $('#' + BRAND_BANNER_ID).removeAttr('style').empty();

        $('body').removeAttr('style').children('a').remove();

        banner.reload();

        banner.onLoadComplete(onMainBannerLoadComplete);
    }

    function onMainBannerLoadComplete() {
        var banner = adriver(MAIN_BANNER_ID);

        if (! banner) {
            return;
        }

        var replyAlt = banner.reply && banner.reply.alt ? banner.reply.alt : '';

        // Check if we have the paired brand banner (Top banner)
        if (replyAlt.indexOf('brand') === -1) {
            $('body').removeClass('branded');
        } else {
            $('body').addClass('branded');
        }

        // Check if we have the paired 240x400 banner (Side banner)
        if (replyAlt.indexOf('240') === -1) {
            // We don't have the paired 240x400 banner (Side banner), so we will try to init or reload the single one instead
            reloadSideBanner();
        }
    }

    function initSideBanner() {
        var banner = adriver(SIDE_BANNER_ID);

        if (! banner) {
            banner = new adriver('adriver_banner_240x400', {
                bn: 1,
                sid: 94027,
                sz: window.siteZone,
                bt: 52
            });
        }
    }

    function reloadSideBanner() {
        var banner = adriver(SIDE_BANNER_ID);

        if (! banner) {
            initSideBanner();

            return;
        }

        var $bannerContainer = $(banner.p);

        if ($bannerContainer.length > 0) {
            $bannerContainer.removeAttr('style').empty();
        }

        banner.reload();
    }

    function reloadStandaloneVisibleBanners() {
        var banners = adriver();

        $.each(banners, function(bannerId, banner) {
            var $window = $(window);
            var $bannerContainer = $(banner.p);

            var bannerIdsToSkip = [
                MAIN_BANNER_ID, SIDE_BANNER_ID, FULLSCREEN_BANNER_ID
            ];

            if ($bannerContainer.length === 0 || bannerIdsToSkip.indexOf(bannerId) > -1 || bannerId.indexOf('adriver_tgb') > -1) {
                return;
            }

            var viewportTop = $window.scrollTop();
            var viewportBottom = viewportTop + $window.innerHeight();
            var viewportLeft = $window.scrollLeft();
            var viewportRight = viewportLeft + $window.innerWidth();

            var bannerTop = $bannerContainer.offset().top;
            var bannerBottom = bannerTop + $bannerContainer.height();
            var bannerLeft = $bannerContainer.offset().left;
            var bannerRight = bannerLeft + $bannerContainer.width();

            if (
                (viewportBottom >= bannerTop && viewportTop <= bannerBottom) &&
                (viewportLeft <= bannerRight && viewportRight >= bannerLeft)
            ) {
                $bannerContainer.empty();

                banner.reload();
            }
        });
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

    function reloadCodeCounters() {
        // LiveInternet
        var city = getCityFromUrl();

        var liCounter = new Image(1, 1);

        var liCounterId = 'liveInternetImg';

        liCounter.src = '//counter.yadro.ru/hit;sobaka-' + city + '?r=' +
            ((typeof(screen) === 'undefined') ? '' : ';s' + screen.width +
                '*' + screen.height + '*' + (screen.colorDepth ? screen.colorDepth :
                    screen.pixelDepth)) + ';u' + escape(document.URL) +
            ';' + Math.random();

        liCounter.id = liCounterId;

        $('#' + liCounterId).remove();

        $('body').append(liCounter);
    }

    function removeAdriverGarbage() {
        // Images
        $('body > img[src*="adriver.ru"]').remove();

        // Iframes
        $('body > iframe[src*="adriver.ru"]').remove();
    }

    function initGlobalReloadControls() {
        $(document).on('click', '.reloadBanners', function() {
            bannersApi.reloadAll();
        });
    }
})($, _, document, window);