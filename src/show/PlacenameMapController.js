'use strict';
function PlacenameMapController($scope, $controller, $location, $routeParams, $timeout,
  NpolarEsriLeaflet, NpolarMessage,
  PlacenameResource,
  npdcAppConfig, L=NpolarEsriLeaflet.L()) {
  'ngInject';

  let self = this;

  // Placename -> npolarApiResource -> ngResource
  $scope.resource = PlacenameResource;

  self.getPoint = (p, includeAltitude=true) => {
    let point;
    if (p.latitude && p.longitude) {
      point = [p.latitude, p.longitude];
      if (true === includeAltitude && p.altitude) {
        point.push(p.altitude);
      }
    } else if (p.geometry) {
      if (p.geometry && p.geometry.type === "Point" && p.geometry.coordinates && p.geometry.coordinates.length > 1) {
        let coordinates = p.geometry.coordinates;
        if (true === includeAltitude && coordinates[2]) {
          point = coordinates;
        } else {
          point = [coordinates[1], coordinates[0]];
        }

      }
    }
    return point;
  };

  self.renderMap = (p) => {

    if (!self.map) {
      self.map = NpolarEsriLeaflet.mapFor(p.area);
    }
    let map = self.map;
    let config =  NpolarEsriLeaflet.configFor(p.area);

    let attribution = `<a href="http://npolar.no">Norsk Polarinstitutt</a>`;
    map.attributionControl.addAttribution(attribution);

    let point = self.getPoint(p);
    if (point.map(c => parseInt(c) !== [0,0])) {
      console.log(point);
      map.setView(point, config.zoom);

      L.circle(point, { radius: 1000 }).bindPopup(`<b>${p.name['@value']}</b><br />${p.area}, ${p.country}`).addTo(map).openPopup();

    } else {
      map.setView(config.view, config.zoom);
    }

  };

  // FIXME: Real test for id is UUID
  if ((/[-]/).test($routeParams.id)) {
    $scope.show().$promise.then(self.renderMap);
  }
}

module.exports = PlacenameMapController;
