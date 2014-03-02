'use strict'

define(['angular', 'jquery', 'underscore'], function (angular, $, _) {

  var controller = function ($rootScope, $scope, $log, group, $parse, $location) {
    $scope.$watch('current.group', function (group) {
      if (!group) {
        $scope.focus = 0
        return
      }

      var s = $location.search().s
      if (!isNaN(s) && s > 0) {
        $scope.focus = s
        return
      }

      if (group.responded) {
        $scope.focus = 2
        return
      }

      $scope.focus = 1
    }, true)

    $parse('current.group').assign($scope, group)

    $scope.$watch('focus', function (focus) {
      $location.search('s', focus)
      $('article').scrollTop(0)
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
