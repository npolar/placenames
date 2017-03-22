'use strict';

function PlacenameSearchController($scope, $controller, $location, $filter,
  NpolarLang,
  npdcAppConfig, PlacenameResource) {
  'ngInject';

  let self = this;
  self.config = { limit: 20,
    fields: 'id,name,created,area,status,country,terrain.en,terrain.nn,terrain_type',
    facets: `status,area,created_by,updated_by,terrain.${NpolarLang.getLang()}`
  };
  self.param = () => $location.search();
  self.latest = false;

  $controller('NpolarBaseController', {
    $scope: $scope
  });
  $scope.resource = PlacenameResource;

  npdcAppConfig.search.local.results.title = (p) => p.name['@value'];
  npdcAppConfig.search.local.results.subtitle = function(p) {

    if ($scope.latest && self.sort === '-created') {
      return $filter('i18n')('New');
    } else if (self.param()['filter-status']) {
      return '';
    } else {
      return p.status;
    }
  };
  npdcAppConfig.search.local.results.detail = function(p) {
    let detail = `${p.area}${ p.country ? ' ['+ p.country +']' : ''} ${ $filter('i18n')(p.terrain) }`;
    if ($scope.latest) {
      detail += ` (${$filter('isodate')(p.created)})`;
    }
    return detail;
  };

  self.query = function() {
    return {
      limit: self.config.limit,
      'size-facet':100,
      facets: self.config.facets,
      score: true
    };
  };

  self.searchLatest = () => {
    PlacenameResource.feed({ q:'', sort:'-created', facets: self.config.facets, limit:self.config.limit, fields: self.config.fields }).$promise.then(r => {
      $scope.latest = true;
      $scope.feed = r.feed;
      self.sort = '-created';
    });
  };

  // When no query: show list of newest names (force official filter )
  if (!self.param().q || self.param().q === "") {
    // Only fires on first load
    $location.search(Object.assign({}, self.param(), { 'filter-status': 'official'}));
    self.searchLatest();
  } else {
    // User query (first load)
    $scope.latest = false;
    $scope.search(self.query());
  }

  $scope.$on('$locationChangeSuccess', (event, data) => {
    $scope.latest = false;
    delete self.sort;
    delete $location.search().sort;
    $scope.search(self.query());
  });
}

module.exports = PlacenameSearchController;