/**
 * This fake function created for preventing error throwing in admin panel
 * and uses only in create or update actions
 */

if (typeof window.adriver !== 'function') {
    window.adriver = function() {
        console.warn('A new fake adriver instance has been created.');
    };

    window.adriver.isFake = true;

    window.adriver.prototype.reload = function() {
        console.warn('The reload method of the fake adriver instance has been called.');
    };
}