'use strict'

define(['angular', 'underscore'], function (angular, _) {
  var controller = function ($rootScope, $scope, $log, group, $parse, $location) {
    $parse('current.group').assign($scope, group)

    $scope.$watch('current.group._id.$oid', function (id) {
      if (!id) {
        $scope.focus = 0
        return
      }

      var s = $location.search().s
      if (!isNaN(s) && s > 0) {
        $scope.focus = s
        return
      }

      $scope.focus = 2
    })

    $scope.$watch('focus', function (focus) {
      $location.search('s', focus)
    })

    $scope.$on('$routeUpdate', function () {
      $scope.focus = $location.search().s
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
