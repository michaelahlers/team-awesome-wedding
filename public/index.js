'use strict'

require({
//  waitSeconds: 60,
//
//  map: {
//    '*': {
//      /* RequireJS plugins. */
//      'async': 'vendor/requirejs-plugins/src/async',
//      'json': 'vendor/requirejs-plugins-master/src/json',
//      'goog': 'vendor/requirejs-plugins-master/src/goog',
//      'noext': 'vendor/requirejs-plugins-master/src/noext',
//      'text': 'vendor/requirejs-text/text'
//    }
//  },
//
  paths: {
    /* Core AngularJS packages. */
//    'angular': 'vendor/angular/angular',
//    'angular-animate': 'vendor/angular-animate/angular-animate',
//    'angular-resource': 'vendor/angular-resource/angular-resource',
//    'angular-route': 'vendor/angular-route/angular-route',
//    'angular-sanitize': 'vendor/angular-sanitize/angular-sanitize',
//
//    'bootstrap': 'vendor/bootstrap/dist/js/bootstrap',
//
    'jquery': 'webjars/jquery/2.1.0/jquery.min'
//
//    'moment': 'vendor/moment/moment',
//
//    'restangular': 'vendor/restangular/dist/restangular',
//
//    'underscore': 'vendor/underscore/underscore'
  },
//
  shim: {
//    'angular': {
//      deps: [ 'jquery' ],
//      exports: 'angular'
//    },
//
//    'angular-animate': ['angular'],
//    'angular-resource': ['angular'],
//    'angular-route': ['angular'],
//    'angular-sanitize': ['angular'],
//
//    'bootstrap': ['jquery'],
//
    'jquery': {
      exports: 'jQuery'
    }
//
//    'restangular': {
//      deps: [ 'angular', 'underscore' ]
//    },
//
//    'underscore': {
//      exports: '_'
//    }
  }
//
//  optimize: 'uglify2',
//  uglify2: {
//    warnings: false,
//    /* Mangling defeats Angular injection by function argument names. */
//    mangle: false
//  }
})

require([
  'jquery'
//  , 'angular'
//
//  , 'angular-route'
//  , 'restangular'
], function ($) {



  $(function () {
    console.log('Loaded!')
//
//    angular
//      .module('taw', [
//        'ngRoute',
//        'restangular'
//      ])
//
//      .config(function ($routeProvider) {
//        $routeProvider.otherwise({
//          redirectTo: '/'
//        })
//      })
//
//      .run(function (Restangular) {
//        Restangular.setBaseUrl('/services')
//
//        Restangular.setRestangularFields({
//          id: "_id.$oid"
//        })
//      })
//
//    /* The requirements on this script ensure the application module has been
//     * defined prior to bootstrapping AngularJS. If this is done in the wrong
//     * order, there will be visible flicker as ngCloak is removed and the main
//     * application scope is digested. */
//
//    angular.bootstrap(document, ['taw'])
//
  })
})


