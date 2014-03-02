define([
  'jquery'
  , 'angular'

  , 'text!./template.html'
  , 'text!./popupTemplate.html'

  , 'restangular'
], function ($, angular, template, popupTemplate) {

  function toArray(value) {
    if (angular.isArray(value)) {
      return value
    }

    return []
  }

  var maps = window.google.maps
    , geocoder = new maps.Geocoder()

  maps.visualRefresh = true

  var locations = [
    {
      name: 'Jaleo',
      address: ['2250 Crystal Drive', 'Arlington, VA 22202'],
      latlng: new maps.LatLng(38.8534779, -77.0495547),
      URL: 'http://jaleo.com/crystal-city',
      imageURL: '/images/jaleo/79370E11-1D09-08FB-3BA22343AE93409B.jpg'
    },
    {
      name: 'Crystal City Water Park',
      address: ['1750 Crystal Drive', 'Arlington, VA 22202'],
      latlng: new maps.LatLng(38.8588471, -77.0491487),
      URL: 'http://crystalcity.org/active/open-spaces/crystal-city-water-park',
      imageURL: '/images/crystal-city-water-park/water-park-tbdstaff-1015_606.jpg'
    },
    {
      name: 'Residence Inn',
      address: ['2850 Potomac Avenue', 'Arlington, VA 22202'],
      latlng: new maps.LatLng(38.8479483, -77.051194),
      URL: 'http://marriott.com/hotels/travel/wasry-residence-inn-arlington-capital-view',
      imageURL: '/images/residence-inn/wasry_phototour09.jpg'
    }
  ]

  return angular
    .module('taw.itinerary', [ 'restangular' ])

    .directive('tawItinerary', function ($compile, $log) {

      return {
        restrict: 'A',
        template: template,
        replace: true,
        scope: {
          'group': '=tawItinerary'
        },
        link: function (scope, iEl, Attrs, ctrl) {
          var map = new maps.Map(iEl.find('.map-canvas')[0], {
            disableDefaultUI: true,
            panControl: false,
            zoomControl: true,
            scrollwheel: true
          })

          var bounds = new maps.LatLngBounds()
          angular.forEach(locations, function (location) {
            bounds.extend(location.latlng)

            var marker = new maps.Marker({
              position: location.latlng,
              map: map
            })

            var popupScope = angular.extend(scope.$new(), location)
            var popup = new maps.InfoWindow({
              content: $compile(popupTemplate)(popupScope)[0]
            })

            maps.event.addListener(marker, 'click', function () {
              scope.$apply(function () {
                scope.focusedLocation = location
              })
            })

            angular.extend(location, {
              marker: marker,
              popup: popup
            })

          })

          map.fitBounds(bounds)

          scope.$watch('focusedLocation', function (location, previousLocation) {
            if (previousLocation) {
              previousLocation.popup.close()
            }

            if (location) {
              location.popup.open(map, location.marker)
            }
          })
        },

        controller: function ($scope) {
          $scope.$watch('group.invitees', function (invitees) {
            invitees = toArray(invitees)

            $scope.preludePartyInvitees = invitees.filter(function (invitee) {
              return (invitee.flags || {}).preludeParty
            })

          })
        }
      }
    })

    .directive('tawItineraryImage', function ($log) {
      return {
        restrict: 'A',
        template: '' +
          '<div>' +
          '  <button type="button" class="btn btn-primary" ng-click="showImage=true" ng-hide="showImage">' +
          '    <i class="fa fa-camera"></i> Show Picture' +
          '  </button>' +
          '  <img ng-if="showImage" class="img-rounded img-responsive" ng-src="{{resolvedImageURI}}">' +
          '</div>',
        replace: false,
        scope: {
          imageURI: '@tawItineraryImage',
          showImage: '@tawImmediate'
        },
        controller: function ($scope) {
          $scope.resolvedImageURI = require.toUrl('.' + $scope.imageURI)
        }
      }
    })
})
