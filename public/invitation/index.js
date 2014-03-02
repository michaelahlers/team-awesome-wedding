define([
  'jquery'
  , 'angular'

  , 'text!./template.html'

  , 'angular-animate'
  , 'restangular'
], function ($, angular, template) {
  return angular
    .module('taw.invitation', [ 'ngAnimate', 'restangular' ])

    .directive('tawInvitation', function ($parse, $location, Restangular) {
      return {
        restrict: 'A',
        template: template,
        replace: true,
        scope: {
          'group': '=tawInvitation'
        },
        link: function (scope, iEl) {
          scope.isTouch = !!('ontouchstart' in window)
        },
        controller: function ($scope) {
          $scope.respond = function (group) {
            var updates = Restangular.one('groups', group._id.$oid)
            updates.responded = true
            updates.put().then(function (currentGroup) {
              if (currentGroup.responded) {
                $location.search('s', 2)
              }
              angular.extend(group, currentGroup)
            })
          }
        }
      }
    })
})
