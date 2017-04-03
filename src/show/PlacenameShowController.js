'use strict';

function PlacenameShowController($scope, $controller, $location, $routeParams, $timeout,
  NpolarMessage,
  PlacenameResource,
  npdcAppConfig) {
  'ngInject';

  let self = this;

  const UUID_REGEX = /[-]/; // well... it'coming FIXME @todo

  console.debug(self);

  // EditController -> NpolarEditController
  $controller('NpolarBaseController', {
    $scope: $scope
  });

  // Placename -> npolarApiResource -> ngResource
  $scope.resource = PlacenameResource;

  self.uuid = (id) => {
    let p = id.split('/');
    return p.pop();
  };

  self.translations = (prop, lang) => {
    return $scope.p.texts[prop];
  };

  self.loadRelations = (p) => {
    self.replaces = [];
    $scope.p = p;

    // breaks back button @todo MERGE with current query...
    // $location.path(p.id).search({name: p.name['@value'], area: p.area });

    if (!p.relations || !p.relations.replaces) {
      return;
    }

    // and the replaced might also be replaced :
    (p.relations.replaces).forEach(r => {
      let id = self.uuid(r['@id']);
      PlacenameResource.get({id}).$promise.then(r => {
        self.replaces.push(r);
      });
    });
    // same_as
    // replaced_by
  };

  self.show = () => {
    let name;
    let id;
    let ident;

    if (UUID_REGEX.test($routeParams.id)) {
      $scope.show().$promise.then(self.loadRelations);
    } else {

      if ($location.search().ident && (/\d+/).test($location.search().ident)) {
        ident = $location.search().ident;
      } else if (!UUID_REGEX.test($routeParams.id)) {
        name = $routeParams.id;
      }

      if (name && !ident) {
        console.debug('name');
        $scope.resource.array({ 'filter-properties.label': name, fields: 'id,area,name.@value', limit: 10, 'filter-status': 'official' }).$promise.then((r) => {

        if (r && r.length > 1) {
          let search = Object.assign({}, $location.search(), { q: name });
          $location.path('/').search(search);
        } else if (r && r.length === 1 && r[0].name['@value'] === name) {
            id = r[0].id;
            console.debug('location.path', id, 'search', {name, area: r[0].area });
            $location.path(id).search({name, area: r[0].area });
          } else {
            $scope.document = {};
            NpolarMessage.error(`Unknown name: ${name}`);
          }
        });

      } else if (ident && !name) {

        console.log('ident', ident);
        $scope.resource.array({ 'filter-ident': ident, fields: 'id,area,name.@value', limit: 10, 'filter-status': 'official' }).$promise.then((r) => {
          if (r && r.length === 1 && r[0].ident === ident) {
            id = r[0].id;
            name = r[0].name['@value']; // if ident === r[0].ident!
            $location.path(id).search({name, area: r[0].area, ident });
          } else {
            $scope.document = {};
            NpolarMessage.error(`Unknown ident: ${ident}`);
          }

        });


      }
    }

  };

  self.show();

}

module.exports = PlacenameShowController;