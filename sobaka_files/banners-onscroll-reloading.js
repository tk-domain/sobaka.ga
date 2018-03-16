(function ($, bannersApi, document, window, undefined) {
    $(function() {
        var $window = $(window);

        var scrHeightChange = 2400;

        var currentRange = [0, scrHeightChange];

        $window.on('scroll', function() {
            if (typeof window.isAdmin === 'undefined' && !isInsideRange()) {
                setNewRange();

                bannersApi.reloadAll();
            }
        });

        function isInsideRange() {
            return $window.scrollTop() >= currentRange[0] && $window.scrollTop() <= currentRange[1];
        }

        function setNewRange() {
            currentRange = [$window.scrollTop() - scrHeightChange, $window.scrollTop() + scrHeightChange];
        }
    });
})(jQuery, bannersApi, document, window);