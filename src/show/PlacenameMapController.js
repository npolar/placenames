'use strict';
function PlacenameMapController($scope, $controller, $location, $routeParams, $timeout, $filter,
  NpolarEsriLeaflet, NpolarMessage,
  PlacenameResource,
  npdcAppConfig) {
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

  self.drawNamesinBox = (map=self.map) => {
    let [w,s,e,n] = map.getBounds().toBBoxString().split(',');
    let names_in_bbox_query = { q:'', 'filter-longitude': `${w}..${e}`, 'filter-latitude': `${s}..${n}`,
      limit: 'all', 'not-id': $routeParams.id, format: 'geojson', fields: 'id,type,geometry,latitude,longitude,name.@value,texts.definition,texts.origin'
    };
    PlacenameResource.feed(names_in_bbox_query).$promise.then(r => {
      console.log('bbox names', r.features.length);
      r.features.forEach(p => {
        let popup = `<a href="${p.id}"><b>${p.name['@value']}</b></a><br/>${ $filter('i18n')(p.texts.definition||'') }<br/>${ $filter('i18n')(p.texts.origin||'') }`;
        L.circle([p.latitude, p.longitude], { radius: 300 }).bindPopup(popup).addTo(self.map);
      });

    });
  };

  self.renderMap = (p={ area: 'Svalbard'}, L=NpolarEsriLeaflet.L()) => {
    if (!self.map) {
      self.map = NpolarEsriLeaflet.mapFor('Svalbard');
    }

    let map = self.map;
    let config =  NpolarEsriLeaflet.configFor(p.area);

    let attribution = `<a href="http://npolar.no">Norsk Polarinstitutt</a>`;
    map.attributionControl.addAttribution(attribution);

    map.on('zoomend', () => {
      self.drawNamesinBox();
    });


    if (p) {
      let point = self.getPoint(p);
      if (point && point.map(c => parseInt(c) !== [0,0])) {
        map.setView(point, config.zoom);
        let circle = L.circle(point, { radius: 1000 });
        circle.bindPopup(`<b>${p.name['@value']}</b><br />${p.area}, ${p.country}`).addTo(map).openPopup();
      } else {
        console.debug(config);
        map.setView(config.view, config.zoom);
      }
    }
  };


  //self.map.setView([77,15], 5);
  //self.renderMap();
  //self.drawNamesinBox();

  // FIXME: Real test for id is UUID
  if ((/[-]/).test($routeParams.id)) {
    $scope.show().$promise.then(self.renderMap);
  } else {
    $timeout(() => {
      self.renderMap();
      self.drawNamesinBox();
    });

  }
}

module.exports = PlacenameMapController;
