define([
  'jquery'
  , 'angular'

  , 'text!./template.html'
  , 'text!./popupTemplate.html'

  , 'restangular'
], function ($, angular, template, popupTemplate) {
  var maps = window.google.maps
    , geocoder = new maps.Geocoder()

  maps.visualRefresh = true

  var locations = [
    {
      name: 'Jaleo',
      address: ['2250 Crystal Drive', 'Arlington, VA 22202'],
      latlng: new maps.LatLng(38.8534779, -77.0495547),
      URL: 'http://jaleo.com/crystal-city'
    },
    {
      name: 'Crystal City Water Park',
      address: ['1750 Crystal Drive', 'Arlington, VA 22202'],
      latlng: new maps.LatLng(38.8588471, -77.0491487),
      URL: 'http://crystalcity.org/active/open-spaces/crystal-city-water-park'
    },
    {
      name: 'Residence Inn',
      address: ['2850 Potomac Avenue', 'Arlington, VA 22202'],
      latlng: new maps.LatLng(38.8479483, -77.051194),
      URL: 'http://marriott.com/hotels/travel/wasry-residence-inn-arlington-capital-view'
    }
  ]

  return angular
    .module('taw.itinerary', [ 'restangular' ])

    .directive('tawItinerary', function ($compile, $log) {

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

            var marker = new maps.Marker({
              position: location.latlng,
              map: map
            })

            var popupScope = scope.$new()
            angular.extend(popupScope, location)

            var popup = new maps.InfoWindow()
            popup.setContent($compile(popupTemplate)(popupScope)[0])
            popup.open(map, marker)
          })

          map.fitBounds(bounds)

        }
      }
    })
})
