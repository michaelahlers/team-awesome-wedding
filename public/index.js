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
//
//    'bootstrap': 'vendor/bootstrap/dist/js/bootstrap',
//
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
//
//    'bootstrap': ['jquery'],
//
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

require([
  'jquery'
  , 'angular'

  , 'angular-route'
  , 'restangular'
], function ($, angular) {


  $(function () {
    angular
      .module('taw', [
        'ngRoute',
        'restangular'
      ])

      .config(function ($routeProvider) {
        $routeProvider.otherwise({
          redirectTo: '/'
        })
      })

      .run(function (Restangular) {
        Restangular.setBaseUrl('/services')

        Restangular.setRestangularFields({
          id: "_id.$oid"
        })
      })

    angular.bootstrap(document, ['taw'])
  })
})


