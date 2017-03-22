'use strict';
var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;

let angular = require('angular');
let app = angular.module('npdcPlacenameApp', ['npdcCommon']);

app.controller('PlacenameSearchController', require('./search/PlacenameSearchController'));
app.controller('PlacenameEditController', require('./edit/PlacenameEditController'));
app.controller('PlacenameShowController', require('./show/PlacenameShowController'));
app.controller('PlacenameMapController', require('./show/PlacenameMapController'));

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/placename', 'resource': 'PlacenameResource' }
];

resources.forEach(service => {
  // Expressive DI syntax is needed here
  app.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
  return NpolarApiResource.resource(service);
  }]);
});

// Routing
app.config(require('./router'));

app.config(($httpProvider, npolarApiConfig) => {
  let autoconfig = new AutoConfig('production');
  Object.assign(npolarApiConfig, autoconfig, { resources });
  console.debug("npolarApiConfig", npolarApiConfig);
  $httpProvider.interceptors.push('npolarApiInterceptor');
});

app.run(($http, npdcAppConfig, NpolarTranslate) => {
  NpolarTranslate.loadBundles('npdc-placename');
});
