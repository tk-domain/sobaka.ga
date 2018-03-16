(function() {
    $(function() {
        $('.b-subscribe-widget__form').submit(function(e) {
            var $form = $(this),
                $message = $form.find('.b-subscribe-widget__message'),
                errorMessageClass = 'b-subscribe-widget__message--error',
                successMessageClass = 'b-subscribe-widget__message--success';

            $.ajax({
                url: $form.attr('action') || '/',
                type: $form.attr('method') || 'POST',
                data: $form.serialize(),
                success: function(response) {
                    var response = JSON.parse(response),
                        success = response.success,
                        message = response.message;

                    $message.removeClass(errorMessageClass + ' ' + successMessageClass);

                    if (! message) {
                        return false;
                    }

                    if (success) {
                        $message.addClass(successMessageClass);
                    } else {
                        $message.addClass(errorMessageClass);
                    }

                    $message.text(message);
                }
            });

            e.preventDefault();
        });
    });
})();