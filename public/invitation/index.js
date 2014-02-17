define([
  'jquery'
  , 'angular'

  , 'text!./template.html'

  , 'angular-animate'
  , 'restangular'
], function ($, angular, template) {
  return angular
    .module('taw.invitation', [ 'ngAnimate', 'restangular' ])

    .directive('tawInvitation', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        template: template,
        replace: true,
        scope: {
          'group': '=tawInvitation'
        },
        controller: function ($scope) {
        }
      }
    })
})
