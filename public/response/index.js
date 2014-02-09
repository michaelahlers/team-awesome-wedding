define([
  'jquery'
  , 'angular'

  , 'text!./template.html'

  , 'restangular'
], function ($, angular, template) {
  return angular
    .module('taw.response', [ 'restangular' ])

    .directive('tawResponse', function () {
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
