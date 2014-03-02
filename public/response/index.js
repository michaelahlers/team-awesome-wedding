define([
  'jquery'
  , 'angular'
  , 'underscore'

  , 'text!./template.html'

  , 'angular-resource'
  , 'restangular'
], function ($, angular, _, template) {

  function toArray(value) {
    if (angular.isArray(value)) {
      return value
    }

    return []
  }

  return angular
    .module('taw.response', [ 'ngResource', 'restangular' ])

    .directive('tawResponse', function () {
      return {
        restrict: 'A',
        template: template,
        replace: true,
        scope: {
          'group': '=tawResponse'
        },
        controller: function ($scope, $parse, Restangular, $log) {
          $scope.isTouch = !!('ontouchstart' in window)

          function updateAttendees(invitees) {
            $scope.attendees = (invitees || [])
              .filter(function (invitee) {
                return invitee.attending
              })
              .reduce(function (accumulator) {
                return accumulator + 1
              }, 0)
          }

          $scope.$watch('group.invitees', updateAttendees, true)

          $scope.toggleAttending = function (invitee) {
            var updates = Restangular.one('invitees', invitee._id.$oid)
            updates.attending = !invitee.attending
            updates.put().then(function (currentInvitee) {
              angular.extend(invitee, currentInvitee)
            })
          }

          var save = _.debounce(function (field, value) {
            $scope.$apply(function () {
              var id = $scope.$eval('group._id.$oid')
              if (!id) {
                return
              }
              var record = Restangular.one('groups', id)
              record[field] = value
              record.put()
            })
          }, 250)

          $scope.$watch('group.comments', function (comments) {
            save('comments', comments)
          })

          $scope.$watch('group.invitees', function (invitees) {
            invitees = toArray(invitees)

            $scope.alternateReceptionInvitees = invitees.filter(function (invitee) {
              return (invitee.flags || {}).alternateReception
            })

          })
        }
      }
    })
})
