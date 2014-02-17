define([
  'jquery'
  , 'angular'

  , 'text!./template.html'

  , 'angular-resource'
  , 'restangular'
], function ($, angular, template) {
  return angular
    .module('taw.code', [ 'ngResource', 'restangular' ])

    .directive('tawCode', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        template: template,
        replace: true,
        scope: true,
        link: function (scope, iEl, iAttrs, ctrl) {

        },
        controller: function ($scope, $resource, $controller) {
          $scope.submit = function () {
            $scope.loading = true
            $resource('/login/:code').get({
              code: $scope.code
            }, function (group) {
              $scope.group = group
              $scope.error = null
              $scope.loading = false
            }, function () {
              $scope.error = 'Wrong code. Try again?'
              $scope.loading = false
            })
          }
        }
      }
    })
})
