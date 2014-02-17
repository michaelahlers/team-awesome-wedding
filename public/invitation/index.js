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
        scope: true,
        link: function (scope, iEl, Attrs, ctrl) {
          ctrl.$render = function () {
            scope.group = ctrl.$viewValue
          }
        },
        controller: function ($scope) {
        }
      }
    })
})
