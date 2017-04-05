'use strict';
// FIXME @todo schema terrrain !
function PlacenameEditController($scope, $controller, $location, $routeParams, $timeout,
  PlacenameResource, formula, formulaAutoCompleteService,
  npdcAppConfig) {
  'ngInject';

  let self = this;

  // EditController -> NpolarEditController
  $controller('NpolarEditController', {
    $scope: $scope
  });

  PlacenameResource.create = function() {
    return { type: "Feature", area: "Svalbard", country:
      "NO", country_of_origin: "NO", latitude: 0, longitude: 0,
      name: { '@language': 'nn' },
      terrain: { en: 'named-place', nn: 'stadnamn'},
      relations: { authority: { '@id': 'npolar.no' } }
    };
  };

  $scope.resource = PlacenameResource;

  self.formulaOptions = {
    schema: '//api.npolar.no/schema/placename-1',
    //schema: 'edit/placename-1.json',
    form: 'edit/formula.json',
    language: 'en',
    templates: npdcAppConfig.formula.templates/*.concat({
      match: "geometry",
      template: "<geojson:edit-geometry></geojson:edit-geometry>"
    })*/
  };
  $scope.formula = formula.getInstance(self.formulaOptions);

  let autocomplete = ['relations.authority.@id', 'relations.name_committee_case.@id', 'name.@language', 'terrain.en', 'terrain.nn'];
  formulaAutoCompleteService.autocompleteFacets(autocomplete, PlacenameResource, $scope.formula);

  // Stupid hacks (3) to propagate positions to the coordinates array
  $scope.$watch('formula.getModel().longitude', (lng, was) => {
    let p = $scope.formula.getModel();
    if (p && p.geometry && p.geometry.type && p.geometry.type==='Point' && p.geometry.coordinates && lng) {
      p.geometry.coordinates[0] = parseFloat(lng);
      $scope.formula.setModel(p);
    }
  });

  $scope.$watch('formula.getModel().latitude', (lat, was) => {
    let p = $scope.formula.getModel();
    if (p && p.geometry && p.geometry.type && p.geometry.type==='Point' && p.geometry.coordinates && lat) {
      p.geometry.coordinates[1] = parseFloat(lat);
      $scope.formula.setModel(p);
    }
  });

  $scope.$watch('formula.getModel().altitude', (alt, was) => {
    let p = $scope.formula.getModel();
    if (p && p.geometry && p.geometry.type && p.geometry.type==='Point' && p.geometry.coordinates && alt) {
      p.geometry.coordinates[2] = parseFloat(alt);
      $scope.formula.setModel(p);
    }
  });

  $scope.edit();
}

module.exports = PlacenameEditController;