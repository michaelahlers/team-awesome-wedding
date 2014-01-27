'use strict'

require({
  waitSeconds: 60,

  map: {
    '*': {
      /* RequireJS plugins. */
      'async': 'vendor/requirejs-plugins/src/async',
      'json': 'vendor/requirejs-plugins-master/src/json',
      'goog': 'vendor/requirejs-plugins-master/src/goog',
      'noext': 'vendor/requirejs-plugins-master/src/noext',
      'text': 'vendor/requirejs-text/text'
    }
  },

  paths: {
    /* Core AngularJS packages. */
    'angular': 'vendor/angular/angular',
    'angular-animate': 'vendor/angular-animate/angular-animate',
    'angular-resource': 'vendor/angular-resource/angular-resource',
    'angular-route': 'vendor/angular-route/angular-route',
    'angular-sanitize': 'vendor/angular-sanitize/angular-sanitize',

    'bootstrap-affix': 'vendor/bootstrap/js/bootstrap-affix',
    'bootstrap-alert': 'vendor/bootstrap/js/bootstrap-alert',
    'bootstrap-button': 'vendor/bootstrap/js/bootstrap-button',
    'bootstrap-carousel': 'vendor/bootstrap/js/bootstrap-carousel',
    'bootstrap-collapse': 'vendor/bootstrap/js/bootstrap-collapse',
    'bootstrap-dropdown': 'vendor/bootstrap/js/bootstrap-dropdown',
    'bootstrap-modal': 'vendor/bootstrap/js/bootstrap-modal',
    'bootstrap-popover': 'vendor/bootstrap/js/bootstrap-popover',
    'bootstrap-scrollspy': 'vendor/bootstrap/js/bootstrap-scrollspy',
    'bootstrap-switch': 'vendor/bootstrap-switch/static/js/bootstrap-switch',
    'bootstrap-tab': 'vendor/bootstrap/js/bootstrap-tab',
    'bootstrap-tooltip': 'vendor/bootstrap/js/bootstrap-tooltip',
    'bootstrap-transition': 'vendor/bootstrap/js/bootstrap-transition',
    'bootstrap-typeahead': 'vendor/bootstrap/js/bootstrap-typeahead',

    'jquery': 'vendor/jquery/jquery',

    'moment': 'vendor/moment/moment',

    'restangular': 'vendor/restangular/dist/restangular',

    'underscore': 'vendor/underscore/underscore'
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

    'bootstrap-affix': ['jquery'],
    'bootstrap-alert': ['jquery'],
    'bootstrap-button': ['jquery'],
    'bootstrap-carousel': ['jquery'],
    'bootstrap-collapse': ['jquery'],
    'bootstrap-dropdown': ['jquery', 'bootstrap-button'],
    'bootstrap-modal': ['jquery', 'bootstrap-transition'],
    'bootstrap-popover': ['jquery', 'bootstrap-tooltip'],
    'bootstrap-scrollspy': ['jquery'],
    'bootstrap-tab': ['jquery'],
    'bootstrap-tooltip': ['jquery'],
    'bootstrap-transition': ['jquery'],
    'bootstrap-typeahead': ['jquery'],

    'jquery': {
      exports: 'jQuery'
    },

    'restangular': {
      deps: [ 'angular' ]
    },

    'underscore': {
      exports: '_'
    }
  },

  optimize: 'uglify2',
  uglify2: {
    warnings: false,
    /* Mangling defeats Angular injection by function argument names. */
    mangle: false
  }
})

define([
  'jquery'
  , 'angular'

  , 'angular-route'
  , 'restangular'

], function ($, angular) {

  $(function () {

    angular
      .module('taw', ['ngRoute', 'restangular'])

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

    /* The requirements on this script ensure the application module has been
     * defined prior to bootstrapping AngularJS. If this is done in the wrong
     * order, there will be visible flicker as ngCloak is removed and the main
     * application scope is digested. */

    angular.bootstrap(document, ['taw'])

  })
})


