define([
  'jquery'
  , 'angular'

  , 'text!./template.html'

  , 'angular-animate'
  , 'restangular'
], function ($, angular, template) {
  var isTouch = !!('ontouchstart' in window)

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
        controller: function ($scope) {
          $parse('resources.respondButton').assign($scope, isTouch ? 'Touch to Respond' : 'Click to Respond')

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
