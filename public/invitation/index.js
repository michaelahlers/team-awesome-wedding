define([
  'jquery'
  , 'angular'

  , 'text!./template.html'

  , 'angular-animate'
  , 'restangular'
], function ($, angular, template) {
  return angular
    .module('taw.invitation', [ 'ngAnimate', 'restangular' ])

    .directive('tawInvitation', function ($location, Restangular) {
      return {
        restrict: 'A',
        require: 'ngModel',
        template: template,
        replace: true,
        scope: {
          'group': '=tawInvitation'
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
