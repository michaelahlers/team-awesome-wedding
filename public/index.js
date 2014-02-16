'use strict'

require({
  map: {
    '*': {
      /* RequireJS plugins. */
      'async': 'webjars/requirejs-plugins/3ff54566f8/async',
      'json': 'webjars/requirejs-plugins/3ff54566f8/json',
      'goog': 'webjars/requirejs-plugins/3ff54566f8/goog',
      'noext': 'webjars/requirejs-plugins/3ff54566f8/noext',
      'text': 'webjars/requirejs-text/2.0.10/text'
    }
  },

  paths: {
    /* Core AngularJS packages. */
    'angular': 'webjars/angularjs/1.2.11/angular.min',
    'angular-animate': 'webjars/angularjs/1.2.11/angular-animate.min',
    'angular-resource': 'webjars/angularjs/1.2.11/angular-resource.min',
    'angular-route': 'webjars/angularjs/1.2.11/angular-route.min',
    'angular-sanitize': 'webjars/angularjs/1.2.11/angular-sanitize.min',

    'bootstrap': 'vendor/bootstrap/dist/js/bootstrap.min',

    'jquery': 'webjars/jquery/2.1.0/jquery.min',

    'moment': 'webjars/momentjs/2.5.0/min/moment.min',

    'restangular': 'webjars/restangular/1.3.1/restangular.min',

    'underscore': 'webjars/underscorejs/1.5.2/underscore-min'
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

  , './controller'
  , 'text!./template.html'

  , 'angular-route'
  , 'restangular'

  , './code/index'
  , './invitation/index'
  , './response/index'
  , './itinerary/index'
], function ($, angular, controller, template) {
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

      .config(function ($routeProvider, $locationProvider) {
        $routeProvider
          .when('/', {
            controller: controller,
            template: template
          })
          .otherwise({
            redirectTo: '/'
          })

        $locationProvider.html5Mode(true)
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


