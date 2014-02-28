'use strict'

require({
  map: {
    '*': {
      /* RequireJS plugins. */
      'async': '/webjars/requirejs-plugins/3ff54566f8/async.js',
      'json': '/webjars/requirejs-plugins/3ff54566f8/json.js',
      'goog': '/webjars/requirejs-plugins/3ff54566f8/goog.js',
      'noext': '/webjars/requirejs-plugins/3ff54566f8/noext.js',
      'propertyParser': '/webjars/requirejs-plugins/3ff54566f8/propertyParser.js',
      'text': '/webjars/requirejs-text/2.0.10/text.js'
    }
  },

  paths: {
    /* Core AngularJS packages. */
    'angular': '/webjars/angularjs/1.2.11/angular.min',
    'angular-animate': '/webjars/angularjs/1.2.11/angular-animate.min',
    'angular-resource': '/webjars/angularjs/1.2.11/angular-resource.min',
    'angular-route': '/webjars/angularjs/1.2.11/angular-route.min',
    'angular-sanitize': '/webjars/angularjs/1.2.11/angular-sanitize.min',

    'bootstrap': 'vendor/bootstrap/dist/js/bootstrap.min',

    'jquery': '/webjars/jquery/2.1.0/jquery.min',

    'moment': '/webjars/momentjs/2.5.0/min/moment.min',

    'restangular': '/webjars/restangular/1.3.1/restangular.min',

    'underscore': '/webjars/underscorejs/1.5.2/underscore-min'
  },

  shim: {
    'angular': {
      deps: [ 'jquery' ],
      exports: 'angular'
    },

    'angular-animate': ['angular'],
    'angular-resource': ['angular'],
    'angular-route': ['angular'],
    'angular-sanitize': ['angular'],

    'bootstrap': ['jquery'],

    'jquery': {
      exports: 'jQuery'
    },

    'moment': {
      exports: 'moment'
    },

    'restangular': {
      deps: [ 'angular', 'underscore' ]
    },

    'underscore': {
      exports: '_'
    }
  }

// optimize: 'uglify2',
// uglify2: {
//   warnings: false,
//   /* Mangling defeats Angular injection by function argument names. */
//   mangle: false
// }
})

define([
  'jquery'
  , 'angular'
  , 'underscore'

  , './controller'
  , 'text!./template.html'

  , 'angular-route'
  , 'restangular'

  , './code/index'
  , './invitation/index'
  , './response/index'
  , './itinerary/index'
], function ($, angular, _, controller, template) {

  $.fn.scrollTo = function( target, options, callback ){
    if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
    var settings = $.extend({
      scrollTarget  : target,
      offsetTop     : 50,
      duration      : 500,
      easing        : 'swing'
    }, options);
    return this.each(function(){
      var scrollPane = $(this);
      var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
      var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
      scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
        if (typeof callback == 'function') { callback.call(this); }
      });
    });
  }

  $(function () {
    angular
      .module('taw', [
        'ngRoute',
        'restangular',
        'taw.code',
        'taw.invitation',
        'taw.response',
        'taw.itinerary'
      ])

      .filter('pick', function ($parse) {
        return function (source, field) {
          var getter = $parse(field)
          if (angular.isArray(source)) {
            return source.map(getter)
          } else {
            return getter(source)
          }
        }
      })

      .filter('join', function () {
        return function (source, initial, last) {
          if (angular.isArray(source)) {
            switch (source.length) {
              case 0:
                return ''
              case 1:
                return '' + source[0]
              case 2:
                return source.join(last)
              default:
                return (_.initial(source).join(initial) + initial).trim() + last + _.last(source)
            }
          } else {
            return '' + source
          }
        }
      })

      .config(function ($routeProvider, $locationProvider) {
        $routeProvider
          .when('/', {
            controller: controller,
            template: template,
            resolve: controller.resolve,
            reloadOnSearch: false
          })
          .otherwise({
            redirectTo: '/'
          })

        //$locationProvider.html5Mode(true)
      })

      .run(function (Restangular) {
        Restangular.setBaseUrl('/services')

        Restangular.setRestangularFields({
          id: "_id.$oid"
        })
      })

      .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($parse, $rootScope, $q) {
          return {
            'response': function (response) {
              $parse('session._current').assign($rootScope, false)
              return response || $q.when(response)
            },

            'responseError': function (reason) {
              $parse('session._current').assign($rootScope, false)
              return $q.reject(reason)
            }
          }
        })
      })

      .run(function ($rootScope, $browser, $log) {
        $rootScope.$watch('session._current', function (current) {
          if (true === current) {
            return
          }

          /* It turns out Angular polls the browser cookies every 100 milliseconds and transfers the changes to its own $cookies service (see https://github.com/angular/angular.js/blob/1bb33cccbe12bda4c397ddabab35ba1df85d5137/src/ngCookies/cookies.js#L58-L66 for details). This would then require polling here to get the recent values. Instead, wait for another caller to invalidate the session's currency and then ask the browser directly for cookies. */

          var cookies = $browser.cookies()
            , rawCookie = cookies['PLAY_SESSION'] || ''

          var rawData = rawCookie.substring(rawCookie.indexOf('-') + 1, rawCookie.length - 1)
          var session = {}

          _.each(rawData.split('&'), function (rawPair) {
            if (!rawPair.length) {
              return
            }

            var pair = rawPair.split('=')

            try {
              session[pair[0]] = angular.fromJson(pair[1])
            } catch (e) {
              session[pair[0]] = pair[1]
            }
          })

          session._current = true

          $rootScope.session = session
        })
      })

    angular.bootstrap(document, ['taw'])
  })
})


