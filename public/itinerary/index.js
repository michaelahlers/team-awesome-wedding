define([
  'jquery'
  , 'angular'

  , 'text!./template.html'

  , 'restangular'
], function ($, angular, template) {
  var maps = window.google.maps
    , geocoder = new maps.Geocoder()

  maps.visualRefresh = true

  var locations = [
    {
      name: 'Jaleo',
      latlng: new maps.LatLng(38.8534779, -77.0495547)
    },
    {
      name: 'Crystal City Water Park',
      latlng: new maps.LatLng(38.8586594, -77.0488019)
    },
    {
      name: 'Residence Inn',
      latlng: new maps.LatLng(38.8479483, -77.051194)
    }
  ]

  return angular
    .module('taw.itinerary', [ 'restangular' ])

    .directive('tawItinerary', function ($log) {

      return {
        restrict: 'A',
        template: template,
        replace: true,
        scope: true,
        link: function (scope, iEl, Attrs, ctrl) {
          var map = new maps.Map(iEl.find('.map-canvas')[0], {
            disableDefaultUI: true,
            panControl: false,
            zoomControl: false
          })

          var bounds = new maps.LatLngBounds()
          angular.forEach(locations, function (location) {
            bounds.extend(location.latlng)

            new maps.Marker({
              position: location.latlng,
              map: map
            })
          })

          map.fitBounds(bounds)

        }
      }
    })
})
