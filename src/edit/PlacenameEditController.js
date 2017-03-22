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

  $scope.edit();
}

module.exports = PlacenameEditController;