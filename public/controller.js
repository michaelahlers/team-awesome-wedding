'use strict'

define(['angular', 'underscore'], function (angular, _) {
  var controller = function ($rootScope, $scope, $log, group, $parse) {
    $parse('current.group').assign($scope, group)

    $scope.$watch('current.group._id.$oid', function (id) {
      $scope.focus = id ? 1 : 0
    })
  }

  controller.resolve = {
    group: function ($rootScope, Restangular) {
      var id = $rootScope.$eval('session.username')
      if (id) {
        return Restangular.one('groups', id).get()
      }
    }
  }

  return controller
})
