'use strict';

var router = function($routeProvider, $locationProvider) {
  'ngInject';

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/:id/edit', {
    controller: 'PlacenameEditController',
    templateUrl: 'edit/edit.html'
  }).when('/:id', {
    templateUrl: 'show/show.html'//,
    //controller: 'PlacenameShowController'
  }).when('/', {
    templateUrl: 'search/search.html',
    controller: 'PlacenameSearchController',
    reloadOnSearch: false
  });
};

module.exports = router;
