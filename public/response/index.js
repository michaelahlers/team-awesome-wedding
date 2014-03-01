define([
  'jquery'
  , 'angular'

  , 'text!./template.html'

  , 'angular-resource'
  , 'restangular'
], function ($, angular, template) {
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

          function updateAttendees() {
            $scope.attendees = ($scope.$eval('group.invitees') || [])
              .filter(function (invitee) {
                return invitee.attending
              })
              .reduce(function (accumulator) {
                return accumulator + 1
              }, 0)
          }

          updateAttendees()

          $scope.toggleAttending = function (invitee) {
            var updates = Restangular.one('invitees', invitee._id.$oid)
            updates.attending = !invitee.attending
            updates.put().then(function (currentInvitee) {
              angular.extend(invitee, currentInvitee)
              updateAttendees()
            })
          }

          $scope.$watch('group.contact', function (contact) {
            $log.log(contact)
            var record = Restangular.one('groups', $scope.group._id.$oid)

            record.contact = contact

            record.put()
          })
        }
      }
    })
})
