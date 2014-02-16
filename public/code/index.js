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
        template: template,
        replace: true,
        scope: {
          'onEnter': '&'
        },
        controller: function ($scope, $resource) {
          $scope.submit = function () {
            $scope.loading = true
            $resource('/enter/:code').get({
              code: $scope.code
            }, function (group) {
              $scope.onEnter({
                group: group
              })
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
