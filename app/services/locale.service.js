(function() {
    'use strict';

    angular
        .module('app.core')
        .service('localeService', localeService);

    function localeService($translate, LOCALES, $rootScope, tmhDynamicLocale) {
        var localesObj = LOCALES.locales;
        var _LOCALES = Object.keys(localesObj);

        if (!_LOCALES || _LOCALES.length === 0) {
            console.error('There are no _LOCALES provided');
        }

        var _LOCALES_DISPLAY_NAMES = [];

        _LOCALES.forEach(function(locale) {
            _LOCALES_DISPLAY_NAMES.push(localesObj[locale]);
        });

        var currentLocale = $translate.proposedLanguage();
        var checkLocaleIsValid = function(locale) {
            return _LOCALES.indexOf(locale) !== -1;
        };

        var setLocale = function(locale) {
            if (!checkLocaleIsValid(locale)) {
                console.error('Locale name "' + locale + '" is invalid');
                return;
            }

            currentLocale = locale;

            // asking angular-translate to load and apply proper translations
            $translate.use(locale);
        };

        // on successful applying translations by angular-translate
        $rootScope.$on('$translateChangeSuccess', function(event, data) {
            document.documentElement.setAttribute('lang', data.language); // sets "lang" attribute to html

            // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
            tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));
        });

        return {
            getPreferredLocale: function() {
                return LOCALES.preferredLocale;
            },
            getPreferredLocaleName: function() {
                return LOCALES.locales[LOCALES.preferredLocale];
            },
            getLocaleDisplayName: function() {
                var val = localesObj[currentLocale];

                if (val === undefined) {
                    val = this.getPreferredLocaleName();
                }

                return val;
            },
            setLocaleByDisplayName: function(localeDisplayName) {
                // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                setLocale(
                    _LOCALES[
                        _LOCALES_DISPLAY_NAMES.indexOf(localeDisplayName) // get locale index
                    ]
                );
            },
            getLocalesDisplayNames: function() {
                return _LOCALES_DISPLAY_NAMES;
            }
        };
    }

})();
