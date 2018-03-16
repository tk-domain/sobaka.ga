(function(document, window) {
    window.Share = {
        title: '',

        description: '',

        image: '',

        url: '',

        updateDefaultShareData: function() {
            var title = document.getElementsByTagName('title')[0];

            var description = document.querySelector('meta[property="og:description"]');

            var image = document.querySelector('meta[property="og:image"]');

            if (title) {
                this.title = encodeURIComponent(title.text);
            }

            if (description) {
                this.description = encodeURIComponent(description.getAttribute('content'));
            }

            if (image) {
                this.image = encodeURIComponent(image.getAttribute('content'));
            }

            this.url = encodeURIComponent(window.location.href);
        },

        popup: function(url) {
            window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
        },

        // Vkontakte
        vk: function(url, title, description, image) {
            this.updateDefaultShareData();

            var popupUrl = 'http://vkontakte.ru/share.php?';

            popupUrl += 'url=' + (url || this.url);

            popupUrl += '&title=' + (title || this.title);

            popupUrl += '&description=' + (description || this.description);

            popupUrl += '&image=' + (image || this.image);

            this.popup(popupUrl);
        },

        // Facebook
        fb: function(url) {
            this.updateDefaultShareData();

            var popupUrl = 'http://www.facebook.com/sharer.php?u=' + (url || this.url);

            this.popup(popupUrl);
        },

        // Twitter
        tw: function(url, text) {
            this.updateDefaultShareData();

            var popupUrl = 'http://twitter.com/share?url=' + (url || this.url);

            popupUrl += '&text=' + (text || this.title);

            this.popup(popupUrl);
        },

        // Odnoklassniki
        ok: function(url, title, description, image) {
            this.updateDefaultShareData();

            var popupUrl = 'https://connect.ok.ru/offer?';

            popupUrl += 'url=' + (url || this.url);

            /*
            popupUrl += '&title' + (title || this.title);

            popupUrl += '&description=' + (description || this.description);

            popupUrl += '&imageUrl=' + (image || this.image);
            */

            this.popup(popupUrl);
        },

        // WhatsApp
        wa: function(text) {
            this.updateDefaultShareData();

            var popupUrl = 'whatsapp://send?text=' + (text || this.url);

            this.popup(popupUrl);
        },

        // Viber
        vb: function(text) {
            this.updateDefaultShareData();

            var popupUrl = 'viber://forward?text=' + (text || this.url);

            this.popup(popupUrl);
        },

        // Telegram
        tg: function(text) {
            this.updateDefaultShareData();

            var popupUrl = 'tg://msg?text=' + (text || this.url);

            this.popup(popupUrl);
        },

        // Facebook Messenger
        fm: function(link) {
            this.updateDefaultShareData();

            var popupUrl = 'fb-messenger://share?link=' + (link || this.url);

            this.popup(popupUrl);
        }
   }
})(document, window);