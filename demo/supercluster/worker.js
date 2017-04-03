'use strict';

importScripts('https://unpkg.com/supercluster@2.3.0/dist/supercluster.min.js');
var now = Date.now();
var index;
// var uri = '//api.npolar.no/placename/?q=&filter-status=official&format=geojson&fields=name.@value,type,geometry,id,texts&sort=-area&limit=all';
var uri = 'np-placenames.json';

getJSON(uri, function (geojson) {
  console.log('loaded ' + geojson.features.length + ' points GeoJSON in ' + ((Date.now() - now) / 1000) + 's');

  index = supercluster({
      log: true,
      radius: 80,
      extent: 256,
      minZoom: 3,
      maxZoom: 10
  }).load(geojson.features);
  //console.log(index.getTile(0, 0, 0));
  postMessage({ready: true});
});

// self -> DedicatedWorkerGlobalScope
self.onmessage = function (e) {
  if (e.data) {
    postMessage(index.getClusters(e.data.bbox, e.data.zoom));
  }
};

function getJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300 && xhr.response) {
      callback(xhr.response);
    }
  };
  xhr.send();
}