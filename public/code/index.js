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
          scope.$watch('group', function (group) {
            if (group) {
              ctrl.$setViewValue(group)
            }
          })
        },
        controller: function ($scope, $resource) {
          $scope.submit = function () {
            $scope.loading = true
            $resource('/login/:code').get({
              code: $scope.code
            }, function (group) {
              $scope.group = group
              $scope.code = null
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
