define([
  'jquery'
  , 'angular'

  , 'text!./template.html'

  , 'restangular'
], function ($, angular, template) {
  return angular
    .module('taw.code', [ 'restangular' ])

    .directive('tawCode', function () {
      return {
        restrict: 'A',
        template: template,
        replace: true,
        scope: true,
        link: function (scope, iEl, Attrs, ctrl) {
        }
      }
    })
})