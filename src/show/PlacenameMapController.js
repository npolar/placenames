'use strict';

function PlacenameMapController($scope, $controller, $location, $routeParams, $timeout, $filter,
  NpolarEsriLeaflet, NpolarMessage,
  PlacenameResource,
  npdcAppConfig) {
  'ngInject';

  let self = this;

  // Placename -> npolarApiResource -> ngResource
  $scope.resource = PlacenameResource;

  $controller('NpolarBaseController', {
    $scope: $scope
  });

  self.mapUri = (p) => {
    let uri = '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    if ('Svalbard' === p.area) {
      uri = '//geodata.npolar.no/arcgis/rest/services/Basisdata/NP_Satellitt_Svalbard_WMTS_25833/MapServer';
    } else if ('Dronning Maud Land' === p.area) {
      uri = '//vilhelm.npolar.no/arcgis/rest/services/Basisdata_Intern/tmp_dmlgeologywork/MapServer';
    }
    return uri;
  };

  self.getPoint = (p, includeAltitude=false) => {
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

  self.popup = (p, current=$routeParams.id) => {
    let name = (p.id !== current) ? `<a href="${p.id}">${p.name['@value']}</a>` : p.name['@value'] ;
    if (!p.texts) {
      p.texts = {};
    }
    let def = $filter('i18n')(p.texts.definition) || '';
    let origin = $filter('i18n')(p.texts.origin) || '';
    let orig = origin.substring(0,300);
    if (orig !== origin) {
      orig += ' […]';
    }
    let coords = JSON.stringify(self.getPoint(p, true).reverse());
    let popup = `<b>${name}</b><br/>${ p.area}, ${p.country}<br/>${ coords }<br/><br/>${ def }<br/><br/>${ orig }`;
    return popup;
  };

  self.drawNamesinBox = (map=self.map, L=NpolarEsriLeaflet.L()) => {
    let [w,s,e,n] = map.getBounds().toBBoxString().split(',');
    console.debug([w,s,e,n]);
    let names_in_bbox_query = { q:'', 'filter-longitude': `${w}..${e}`, 'filter-latitude': `${s}..${n}`,
      limit: 'all',
      'filter-status': 'official',
      'not-id': $routeParams.id,
      format: 'geojson',
      fields: 'id,type,area,country,geometry,latitude,longitude,name.@value,texts'
    };
    PlacenameResource.feed(names_in_bbox_query).$promise.then(r => {
      console.log('bbox names', r.features.length);
      r.features.forEach(p => {
        let circle = L.circle([p.latitude, p.longitude], { radius: 300, weight: 1 });
        let circlePopup = circle.bindPopup(self.popup(p));
        circlePopup.on('click', () => circle.openPopup());
        //circlePopup.on('mouseout', () => circle.closePopup());
        circle.addTo(self.map);
      });

    });
  };

  self.renderMap = (p={ area: 'Svalbard'}, L=NpolarEsriLeaflet.L()) => {
    let config =  NpolarEsriLeaflet.configFor(p.area, { element: 'np-placenames-show-map'});
    if (!self.map) {
      self.map = NpolarEsriLeaflet.mapFor(p.area); //actory(self.mapUri(p));
    }

    let map = self.map;


    //let attribution = `<a href="http://npolar.no">Norsk Polarinstitutt</a>`;
    //map.attributionControl.addAttribution(attribution);
    //map.attributionControl.addAttribution('NpolarEsriLeaflet.attributionFor '+ NpolarEsriLeaflet.uri({epsg: config.epsg}));

    map.on('zoomend', () => {
      self.drawNamesinBox();
    });

    // Create large circle for name
    if (p) {
      let point = self.getPoint(p);
      // ... but not if the position is [0,0]
      if (point && point[0] && point[1] && point[0].to_i !== 0 && point[1].to_i !== 0) {
        map.setView(point, config.zoom);
        let circle = L.circle(point, { radius: 1000, color: 'red', weight: 1 });
        circle.bindPopup(self.popup(p)).addTo(map).openPopup();
      } else {
        // if [0,0] try to find position of newer name
        if (p.relations && p.relations.replaced_by) {
          let replaced_by_id = p.relations.replaced_by[0]['@id'];
          if (/^http/.test(replaced_by_id)) {
            replaced_by_id = replaced_by_id.split('/').pop();
          }
          PlacenameResource.get({id: replaced_by_id}).$promise.then(replaced_by => {
            point = self.getPoint(replaced_by);
            map.setView(point, config.zoom);
            let circle = L.circle(point, { radius: 1000, color: 'red', weight: 1 });
            circle.bindPopup(`<b>${replaced_by.name['@value']}</b><br />${replaced_by.area}, ${replaced_by.country}`).addTo(map).openPopup();
          });

        } else {
          map.setView(config.view, config.zoom);
        }


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
