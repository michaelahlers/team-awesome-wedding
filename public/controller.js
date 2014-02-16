'use strict'

define(['angular', 'underscore'], function (angular, _) {
  var controller = function ($rootScope, $scope, $log, group) {
    $scope.group = group
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
