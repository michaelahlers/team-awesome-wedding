define([
  'jquery'
  , 'angular'

  , 'text!./template.html'

  , 'restangular'
], function ($, angular, template) {
  return angular
    .module('taw.itinerary', [ 'restangular' ])

    .directive('tawItinerary', function ($log) {
      var maps = window.google.maps

      return {
        restrict: 'A',
        template: template,
        replace: true,
        scope: true,
        link: function (scope, iEl, Attrs, ctrl) {
          var map = new maps.Map(iEl.find('.map-canvas')[0], {
            mapTypeId: maps.MapTypeId.TERRAIN,
            disableDefaultUI: true,
            panControl: true,
            zoomControl: true,
            zoom: 8,
            center: new maps.LatLng(-34.397, 150.644)
          })
        }
      }
    })
})
